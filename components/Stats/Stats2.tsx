import Lt from "./stats2.module.css"
import { useState, useEffect } from "react";

const Stats2 = ({ statistics }: { statistics: any }) => { 
  useEffect(() => {
    document.getElementById("scroller")?.addEventListener("click", () => {
      document.getElementById("games")?.scrollBy(10, 0)
    })
    document.getElementById("scrollerback")?.addEventListener("click", () => {
      document.getElementById("games")?.scrollBy(-10, 0)
    })
  })

  useEffect(() => {
    document.getElementById("scroller")?.addEventListener("click", () => {
      document.getElementById("games2")?.scrollBy(10, 0)
    })
    document.getElementById("scrollerback")?.addEventListener("click", () => {
      document.getElementById("games2")?.scrollBy(-10, 0)
    })
  })
  useEffect(() => {
    document.getElementById("scroller")?.addEventListener("click", () => {
      document.getElementById("games3")?.scrollBy(10, 0)
    })
    document.getElementById("scrollerback")?.addEventListener("click", () => {
      document.getElementById("games3")?.scrollBy(-10, 0)
    })
  })
  return (
    <div className={`${Lt.root}` }>
    <div id="freed" className="grid [&>*:nth-child(odd):not(:first-child)]:bg-gray-medium [&>*:nth-child(even)]:bg-gray-light  grid-flow-rows auto-rows-[50px] space-y-2 content-center justify-items-center">
      
      
      <div className=" w-full grid grid-cols-1 items-center my-auto ">
        <div className="flex flex-row">
          <button id="scroller" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#FF9429" className="w-8 h-5 rounded-full   fixed border  top-32 right-[50px]">
<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
        </svg></button>
        
          <button id="scrollerback" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#FF9429" className="w-8 h-5 rounded-full rotate-180  fixed border  top-32 left-[510px]">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
</svg>
          </button>
        </div>
        <div className="grid grid-flow-col auto-cols-[95px] text-center">
          <p>NAME</p>
        <p >REGION</p>
        <p>TEAM</p>
        <p>ROLE</p>
          <p >PRICE</p>
          <p className="invisible" >|</p>
         
        
          
          <div id= "games" className={`${Lt.team} grid text-center grid-flow-col justify-items-center content-center auto-cols-[70px]  overflow-x-scroll overflow-y-hidden  w-[1000px]`}>
            
            <p>GAME1</p>
            <p>GAME2</p>
            <p>GAME3</p>
            <p>GAME4</p>
            <p>GAME5</p>
            <p>GAME6</p>
            <p>GAME7</p>
            <p>GAME8</p>
            <p>GAME9</p>
            <p>GAME10</p>
            <p>GAME11</p>
            <p>GAME12</p>
            <p>GAME13</p>
            <p>GAME14</p>
            <p>GAME15</p>
            <p>GAME16</p>
            <p>GAME17</p>
            <p>GAME18</p>
            <p>GAME19</p>
            <p>GAME20</p>
            <p>GAME21</p>
            <p>GAME22</p>
            <p>GAME23</p>

          </div>
      </div>
      </div>
      <div className="w-full grid grid-cols-1 items-center my-auto rounded-full">
        <div className="grid grid-flow-col auto-cols-[95px] text-center">
          <p>Kingen</p>
        <p>LEC</p>
        <p>100 Thieves</p>
        <p>SUPPORT</p>
          <p>$50000</p>
          <p >|</p>
          
          <div  id= "games2" className={`${Lt.team} grid grid-flow-col content-center justify-items-center space-x-3 auto-cols-[70px] overflow-x-scroll overflow-y-hidden w-[1000px]`}>
            
            <p>81</p>
            <p>82</p>
            <p>83</p>
            <p>84</p>
            <p>85</p>
            <p>86</p>
            <p>87</p>
            <p>88</p>
            <p>89</p>
            <p>90</p>
            <p>91</p>
            <p>92</p>
            <p>93</p>
            <p>94</p>
            <p>95</p>
            <p>96</p>
            <p>97</p>
            <p>98</p>
            <p>99</p>
            <p>100</p>
            <p>101</p>
            <p>102</p>
            <p>103</p>


          </div>
      </div>
      </div>
      <div className="w-full grid grid-cols-1 items-center my-auto rounded-full">
        <div className="grid grid-flow-col auto-cols-[95px] text-center">
        <p>Messi</p>
        <p>LEC</p>
        <p>100 Thieves</p>
        <p>SUPPORT</p>
          <p>$50000</p>
          <p >|</p>
   
          <div id= "games3" className={`${Lt.team} grid grid-flow-col content-center justify-items-center space-x-3 auto-cols-[70px] overflow-x-scroll overflow-y-hidden w-[1000px]`}>
            
            <p>81</p>
            <p>82</p>
            <p>83</p>
            <p>84</p>
            <p>85</p>
            <p>86</p>
            <p>87</p>
            <p>88</p>
            <p>89</p>
            <p>90</p>
            <p>91</p>
            <p>92</p>
            <p>93</p>
            <p>94</p>
            <p>95</p>
            <p>96</p>
            <p>97</p>
            <p>98</p>
            <p>99</p>
            <p>100</p>
            <p>101</p>
            <p>102</p>
            <p>103</p>

            </div>
          </div>
    
      </div>
  
    </div>
  </div>
  )
}


export default Stats2
