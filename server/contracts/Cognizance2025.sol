// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FreelancePayments for Cognizance2025
 * @dev Smart contract for managing milestone-based payments between clients and freelancers
 */
contract Cognizance2025Payments {
    enum MilestoneStatus { Pending, InProgress, UnderReview, Completed, Disputed }
    
    struct Milestone {
        string milestoneId;    // MongoDB ID for reference
        string title;
        uint256 amount;
        uint256 dueDate;
        MilestoneStatus status;
        bool isPaid;
    }
    
    struct Project {
        string projectId;      // MongoDB ID for reference
        address employer;
        address freelancer;
        uint256 totalAmount;
        uint256 released;
        bool isActive;
        mapping(uint256 => Milestone) milestones;
        uint256 milestoneCount;
    }
    
    // Platform fee (in basis points, 100 = 1%)
    uint256 public platformFeeRate = 250; // 2.5%
    address public platformWallet;
    string public platformName = "Cognizance2025";
    
    // Project tracking
    mapping(uint256 => Project) public projects;
    uint256 public projectCount;
    
    // Events
    event ProjectCreated(uint256 projectId, string dbProjectId, address employer, address freelancer);
    event MilestoneAdded(uint256 projectId, uint256 milestoneId, string dbMilestoneId, string title, uint256 amount);
    event MilestoneStatusChanged(uint256 projectId, uint256 milestoneId, MilestoneStatus status);
    event PaymentReleased(uint256 projectId, uint256 milestoneId, address freelancer, uint256 amount, uint256 fee);
    event DisputeRaised(uint256 projectId, uint256 milestoneId);
    event DisputeResolved(uint256 projectId, uint256 milestoneId, address winner, uint256 amount);
    event ProjectCancelled(uint256 projectId);
    event FundsWithdrawn(uint256 projectId, address employer, uint256 amount);
    
    constructor(address _platformWallet) {
        platformWallet = _platformWallet;
    }
    
    // Set platform fee rate (only contract owner)
    function setPlatformFeeRate(uint256 _feeRate) external {
        require(msg.sender == platformWallet, "Only platform wallet can update fee rate");
        require(_feeRate <= 1000, "Fee rate cannot exceed 10%"); // Max 10%
        platformFeeRate = _feeRate;
    }
    
    // Create new project with initial funding
    function createProject(string calldata _projectId, address _freelancer) external payable returns (uint256) {
        require(msg.value > 0, "Project must be funded with ETH");
        
        projectCount++;
        uint256 projectId = projectCount;
        
        Project storage project = projects[projectId];
        project.projectId = _projectId;
        project.employer = msg.sender;
        project.freelancer = _freelancer;
        project.totalAmount = msg.value;
        project.isActive = true;
        
        emit ProjectCreated(projectId, _projectId, msg.sender, _freelancer);
        
        return projectId;
    }
    
    // Add funding to an existing project
    function addFunding(uint256 _projectId) external payable {
        Project storage project = projects[_projectId];
        
        require(project.isActive, "Project is not active");
        require(msg.sender == project.employer, "Only the employer can add funds");
        
        project.totalAmount += msg.value;
    }
    
    // Add milestone to a project
    function addMilestone(
        uint256 _projectId,
        string calldata _milestoneId,
        string calldata _title,
        uint256 _amount,
        uint256 _dueDate
    ) external {
        Project storage project = projects[_projectId];
        
        require(msg.sender == project.employer, "Only employer can add milestones");
        require(project.isActive, "Project is not active");
        require(_amount + project.released <= project.totalAmount, "Insufficient funds in project");
        
        uint256 milestoneId = project.milestoneCount;
        
        project.milestones[milestoneId] = Milestone({
            milestoneId: _milestoneId,
            title: _title,
            amount: _amount,
            dueDate: _dueDate,
            status: MilestoneStatus.Pending,
            isPaid: false
        });
        
        project.milestoneCount++;
        
        emit MilestoneAdded(_projectId, milestoneId, _milestoneId, _title, _amount);
    }
    
    // Start milestone (freelancer)
    function startMilestone(uint256 _projectId, uint256 _milestoneId) external {
        Project storage project = projects[_projectId];
        Milestone storage milestone = project.milestones[_milestoneId];
        
        require(msg.sender == project.freelancer, "Only freelancer can start milestone");
        require(project.isActive, "Project is not active");
        require(milestone.status == MilestoneStatus.Pending, "Milestone not in pending state");
        
        milestone.status = MilestoneStatus.InProgress;
        
        emit MilestoneStatusChanged(_projectId, _milestoneId, MilestoneStatus.InProgress);
    }
    
    // Mark milestone for review (freelancer)
    function submitForReview(uint256 _projectId, uint256 _milestoneId) external {
        Project storage project = projects[_projectId];
        Milestone storage milestone = project.milestones[_milestoneId];
        
        require(msg.sender == project.freelancer, "Only freelancer can submit work");
        require(project.isActive, "Project is not active");
        require(milestone.status == MilestoneStatus.InProgress, "Milestone not in progress");
        
        milestone.status = MilestoneStatus.UnderReview;
        
        emit MilestoneStatusChanged(_projectId, _milestoneId, MilestoneStatus.UnderReview);
    }
    
    // Approve milestone and release payment (employer)
    function approveMilestone(uint256 _projectId, uint256 _milestoneId) external {
        Project storage project = projects[_projectId];
        Milestone storage milestone = project.milestones[_milestoneId];
        
        require(msg.sender == project.employer, "Only employer can approve milestone");
        require(project.isActive, "Project is not active");
        require(milestone.status == MilestoneStatus.UnderReview, "Milestone not under review");
        require(!milestone.isPaid, "Payment already released");
        
        // Calculate platform fee
        uint256 fee = (milestone.amount * platformFeeRate) / 10000;
        uint256 paymentAmount = milestone.amount - fee;
        
        // Update milestone status
        milestone.status = MilestoneStatus.Completed;
        milestone.isPaid = true;
        project.released += milestone.amount;
        
        // Send platform fee
        (bool feeSuccess, ) = platformWallet.call{value: fee}("");
        require(feeSuccess, "Platform fee transfer failed");
        
        // Send payment to freelancer
        (bool paySuccess, ) = project.freelancer.call{value: paymentAmount}("");
        require(paySuccess, "Payment transfer failed");
        
        emit MilestoneStatusChanged(_projectId, _milestoneId, MilestoneStatus.Completed);
        emit PaymentReleased(_projectId, _milestoneId, project.freelancer, paymentAmount, fee);
    }
    
    // Raise dispute for a milestone
    function raiseDispute(uint256 _projectId, uint256 _milestoneId) external {
        Project storage project = projects[_projectId];
        Milestone storage milestone = project.milestones[_milestoneId];
        
        require(msg.sender == project.employer || msg.sender == project.freelancer, "Only project participants can raise disputes");
        require(project.isActive, "Project is not active");
        require(milestone.status == MilestoneStatus.UnderReview, "Can only dispute milestones under review");
        require(!milestone.isPaid, "Cannot dispute already paid milestone");
        
        milestone.status = MilestoneStatus.Disputed;
        
        emit MilestoneStatusChanged(_projectId, _milestoneId, MilestoneStatus.Disputed);
        emit DisputeRaised(_projectId, _milestoneId);
    }
    
    // Resolve dispute (admin only via platform wallet)
    function resolveDispute(
        uint256 _projectId, 
        uint256 _milestoneId, 
        address _winner, 
        uint256 _amount
    ) external {
        require(msg.sender == platformWallet, "Only platform admin can resolve disputes");
        
        Project storage project = projects[_projectId];
        Milestone storage milestone = project.milestones[_milestoneId];
        
        require(milestone.status == MilestoneStatus.Disputed, "Milestone not disputed");
        require(_amount <= milestone.amount, "Amount exceeds milestone amount");
        require(_winner == project.employer || _winner == project.freelancer, "Winner must be employer or freelancer");
        
        milestone.status = MilestoneStatus.Completed;
        milestone.isPaid = true;
        project.released += _amount;
        
        // Calculate platform fee
        uint256 fee = (_amount * platformFeeRate) / 10000;
        uint256 paymentAmount = _amount - fee;
        
        // Send platform fee
        (bool feeSuccess, ) = platformWallet.call{value: fee}("");
        require(feeSuccess, "Platform fee transfer failed");
        
        // Send payment to winner
        (bool paySuccess, ) = _winner.call{value: paymentAmount}("");
        require(paySuccess, "Payment transfer failed");
        
        emit MilestoneStatusChanged(_projectId, _milestoneId, MilestoneStatus.Completed);
        emit DisputeResolved(_projectId, _milestoneId, _winner, paymentAmount);
    }
    
    // Get milestone details
    function getMilestone(uint256 _projectId, uint256 _milestoneId) external view 
        returns (string memory, string memory, uint256, uint256, MilestoneStatus, bool) {
        Project storage project = projects[_projectId];
        Milestone storage milestone = project.milestones[_milestoneId];
        
        return (
            milestone.milestoneId,
            milestone.title,
            milestone.amount,
            milestone.dueDate,
            milestone.status,
            milestone.isPaid
        );
    }
    
    // Get project details
    function getProjectSummary(uint256 _projectId) external view 
        returns (string memory, address, address, uint256, uint256, bool, uint256) {
        Project storage project = projects[_projectId];
        
        return (
            project.projectId,
            project.employer,
            project.freelancer,
            project.totalAmount,
            project.released,
            project.isActive,
            project.milestoneCount
        );
    }
    
    // Withdraw remaining funds (employer only, for cancelled projects)
    function withdrawRemaining(uint256 _projectId) external {
        Project storage project = projects[_projectId];
        
        require(msg.sender == project.employer, "Only employer can withdraw");
        require(project.isActive, "Project must be active");
        
        uint256 remaining = project.totalAmount - project.released;
        require(remaining > 0, "No funds to withdraw");
        
        project.totalAmount = project.released;
        project.isActive = false;
        
        (bool success, ) = project.employer.call{value: remaining}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(_projectId, project.employer, remaining);
    }
    
    // Cancel project (admin function for emergency situations)
    function cancelProject(uint256 _projectId) external {
        require(msg.sender == platformWallet, "Only platform admin can cancel projects");
        
        Project storage project = projects[_projectId];
        require(project.isActive, "Project is not active");
        
        project.isActive = false;
        
        // Return remaining funds to employer
        uint256 remaining = project.totalAmount - project.released;
        if (remaining > 0) {
            (bool success, ) = project.employer.call{value: remaining}("");
            require(success, "Fund return failed");
        }
        
        emit ProjectCancelled(_projectId);
    }
    
    // Get platform balance
    function getPlatformBalance() external view returns (uint256) {
        return address(this).balance;
    }
}