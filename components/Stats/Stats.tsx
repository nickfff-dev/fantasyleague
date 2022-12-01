import { useState, useEffect } from 'react';
 import St from "./stats.module.css";



const Stats = ({ players }: { players: any }) => {
  return (<div className={`${St.root}`}>
    <div className={`${St.datafilters}`}>
      <div className={`${St.datafiltersleft}`}>
        <button>SCORE</button>
        <button>STATS</button>
      </div>
      <div className={`${St.datafiltersright}`}>
        <span>VIEW:Players</span>
        <span>SPLIT:SUMMER/2022</span>
        <span>REGION:LEC</span>
        <span>ROLE: SUPPORT</span>
      <input type="text" placeholder="Search" />
      </div>
    </div>
    <div className={`${St.data}`}>
      <div className={`${St.dataleftcontainer}`}><div className={`${St.dataleft}`}>
      <span>NAME</span>
        <span>REGION</span>
        <span>TEAM</span>
        <span>ROLE</span>
        <span>PRICE</span>
      
      </div>
      <div className={`${St.dataleft}`}>
      <span>DOVE</span>
        <span>TOP</span>
        <span>DRX</span>
        <span>SUPPORT</span>
        <span>50,000</span>
        </div>
        <div className={`${St.dataleft}`}>
      <span>DOVE</span>
        <span>TOP</span>
        <span>DRX</span>
        <span>SUPPORT</span>
        <span>50,000</span>
      
      </div>
      </div>
      <div className={`${St.datarightcontainer}`}>
        <div className={`${St.dataright}`}>

        <span>GAME1</span>
        <span>GAME2</span>
        <span>GAME3</span>
        <span>GAME4</span>
        <span>GAME5</span>
        <span>GAME6</span>
        <span>GAME7</span>
        <span>GAME8</span>
        <span>GAME9</span>
        <span>GAME10</span>
        <span>GAME11</span>
          <span>GAME12</span>
          <span>GAME13</span>
          <span>GAME14</span>
          <span>GAME12</span>
          <span>GAME13</span>
        <span>GAME14</span>
      
      
      
      </div>
      <div className={`${St.dataright}`}>
    
        <span>81</span>
        <span>82</span>
        <span>83</span>
        <span>84</span>
        <span>85</span>
        <span>86</span>
        <span>87</span>
        <span>88</span>
        <span>89</span>
        <span>90</span>
        <span>91</span>
          <span>92</span>
          <span>93</span>
          <span>94</span>
          <span>92</span>
          <span>93</span>
        <span>94</span>
      
        </div>
        <div className={`${St.dataright}`}>
    
    <span>81</span>
    <span>82</span>
    <span>83</span>
    <span>84</span>
    <span>85</span>
    <span>86</span>
    <span>87</span>
    <span>88</span>
    <span>89</span>
    <span>90</span>
    <span>91</span>
    <span>92</span>
    <span>93</span>
          <span>94</span>
          <span>92</span>
    <span>93</span>
        <span>94</span>
  </div>
      </div>
    </div>
   
  </div>)
 }


 export default Stats
