import Us from './profile.module.css'

const UserProfile = () => { 
  



  return (
    <div className={`${Us.root}`}>
      <div className={`${Us.container}`}>
        <div className={`${Us.containerleft}`}>
          <div className={`${Us.containerleftinner}`}>
            <img src="https://i.redd.it/rtqwmwm3tdy41.png" className="w-40 h-40" /> 
            <div className={`${Us.containerleftinnertext}`}>
              <div className={`${Us.profiletext}`}><h1>Username:</h1> <p>My name</p></div>
              <div className={`${Us.profiletext}`}><h1>Email:</h1> <p>Myemalil@yahooo.com</p></div>
              <div className={`${Us.profiletext}`}><h1>Dob:</h1> <p>12/24/2022</p></div>
              <div className={`${Us.profiletext}`}><h1>Locale:</h1> <p> {Intl.DateTimeFormat().resolvedOptions().timeZone}</p></div>
            </div>

            </div>
        </div>
        <div className={`${Us.containerRight} `}>
          <h1>UpcomingDrafts</h1>
          <div className={`${Us.H}`}>
              <h1>FantasyName</h1>
            <h1>Leaguename</h1>
            <h1>draftDate</h1>
            <h1>draftConfirmed</h1></div>
          <div className={`${Us.containerRightInner} [&>*:nth-child(odd)]:bg-gray-medium [&>*:nth-child(even)]:bg-gray-light p-3 `}>
        
    
            <div className={`${Us.H}`}>
              <p> TeamA</p>
            <p> THEBESTlEAGUE</p>
            <p> 12/24/2022</p>
              <p> true</p></div>
              <div className={`${Us.H}`}>
              <p> TeamA</p>
            <p> THEBESTlEAGUE</p>
            <p> 12/24/2022</p>
              <p> true</p></div>
              <div className={`${Us.H}`}>
              <p> TeamA</p>
            <p> THEBESTlEAGUE</p>
            <p> 12/24/2022</p>
              <p> true</p></div>
              <div className={`${Us.H}`}>
              <p> TeamA</p>
            <p> THEBESTlEAGUE</p>
            <p> 12/24/2022</p>
              <p> true</p></div>
              <div className={`${Us.H}`}>
              <p> TeamA</p>
            <p> THEBESTlEAGUE</p>
            <p> 12/24/2022</p>
            <p> true</p></div>
          </div>

        </div>
        <div className={`${Us.containerRight2} `}>
          <h1>Transaction History</h1>
          <div className={`${Us.H}`}>
              <h1>Type</h1>
            <h1>date</h1>
            <h1>amount</h1>
            <h1>completed</h1></div>
          <div className={`${Us.containerRightInner} p-3 [&>*:nth-child(odd):not(:first-child)]:bg-gray-medium [&>*:nth-child(even)]:bg-gray-light `}>
        
    
            <div className={`${Us.H}`}>
              <p> deposit</p>
            <p> 12/24/2022</p>
            <p> 100</p>
              <p> true</p></div>
              <div className={`${Us.H}`}>
              <p> deposit</p>
            <p> 12/24/2022</p>
            <p> 100</p>
              <p> true</p></div>
              <div className={`${Us.H}`}>
              <p> deposit</p>
            <p> 12/24/2022</p>
            <p> 100</p>
              <p> true</p></div>
              <div className={`${Us.H}`}>
              <p> deposit</p>
            <p> 12/24/2022</p>
            <p> 100</p>
              <p> true</p></div>
              <div className={`${Us.H}`}>
              <p> deposit</p>
            <p> 12/24/2022</p>
            <p> 100</p>
              <p> true</p></div>
          </div>

        </div>

        </div>
      
    </div>
  );
};


export default UserProfile;
