import { useState } from "react";

const getRandomColor = (name) => {
    const colors = ["#780C28", "#DD88CF", "#FADA7A", "#09122C", "#B771E5", "#AEEA94","#16C47F", "#7E5CAD", ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };
  
  const Avatar = ({ username, avatar_url, className,showBorder}) => { 
    // const [isLoading, setIsLoading] = useState(false);
    return (
      <div className={`rounded-full overflow-hidden w-full h-full ${showBorder&&"bg-bloopy"} p-[2px]  ${className}`}>
        {avatar_url?(
          <img src={`http://localhost:5000${avatar_url}`}
            className="w-full h-full object-cover rounded-full"
            alt="Profile"/>
        ):
        (<div className={`w-full h-full font-neue flex items-center justify-center rounded-full text-white text-opacity-60 font-bold`}
          style={{ backgroundColor: getRandomColor(username) }}>
          {username[0].toUpperCase()}
        </div>
        )
        }
      </div>
    );

  };
  
  export default Avatar;
  