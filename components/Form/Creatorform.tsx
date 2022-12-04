import { League as Mchezo,Fixture, Teams,  Players } from "@prisma/client"
import { useEffect, useState } from "react";
import prisma from '@lib/prisma';
import dayjs from "dayjs";
import Ct from "./creater.module.css"
const CreateLeague = ({username}:{username:any}) => {
  

  const[leaguelink, setLeagueLink] = useState("")
 
  const [league, setLeague] = useState<Mchezo>();
  const [newLeaguedata, setNewLeaguedata] = useState({
    name: "",
    region: "",
    owner:username,
    inviteOnly: "false",
    draftTime: "",
    startDate: "",
    endDate: "",
    buyIn: "false",
    buyInFee: 0,
    duration: 0,
    houseFee: 0,
    minPlayers: 0,
    maxPlayers: 0,
   
  

  })
  const submitLeague = async () => { 

    const body = newLeaguedata
        // check for empty fields
        if (body.name === "" || body.region === "" || body.owner === "" || body.inviteOnly === "" ||  body.draftTime === "" || body.startDate === "" || body.endDate === "" || body.buyIn === "" ||   body.minPlayers === 0 || body.maxPlayers === 0) { 
          alert("All fields are required")
          return
        }
      
        await fetch("/api/create-league", {
          method: 'POST',
          body: JSON.stringify(body)
        }).then((res) => {
          res.text().then((text) => {
            setLeagueLink(text)
            alert("League Created Successfully")
          })
        }).catch((err: any) => { 
          console.error(err.message);
        })
 
    
      }
  return (<div className={`${Ct.root}`}>



    <div className="min-h-screen p-3 space-x-5 bg-gray-dark flex items-start justify-center">

      <div className="container max-w-[600px]">
     
        <div>
          
         


          <div className="rounded-xl bg-gradient-to-r from-primary to-secondary shadow-lg p-1   md:p-8 mb-6">
            <div className="bg-gray-medium p-4 px-4 rounded-xl ">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-white mb-6">
                  <p className="font-medium text-lg bg-gradient-to-r from-primary via-[#f43d00] to-secondary bg-clip-text font-bold text-transparent">Fantasy League Details</p>
                  <p className="bg-gradient-to-r from-primary via-[#f43d00] to-secondary bg-clip-text font-bold text-transparent">Please fill out all the fields.</p>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5 text-white mb-6">
                      <label className="uppercase" htmlFor="league_name ">League Name</label>
                      <input  onChange={
              (e) => { 
                setNewLeaguedata({ ...newLeaguedata, name: e.target.value })
                console.log(newLeaguedata)
              }
            }type="text" name="name" id="league_name" className="h-10  text-gray-300 font-bold  mt-1  px-4 w-full bg-gray-light rounded-full"  />
                    </div>

                    <label className="md:col-span-5 text-white uppercase mb-6" htmlFor="region">Choose a region:
                      <select onChange={
                (e) => {
                  setNewLeaguedata({ ...newLeaguedata, region: e.target.value })
                 
                  console.log(newLeaguedata)
                 
                }
            } className="h-10  mt-1 text-gray-400 font-bold rounded px-4 w-full  bg-gray-light rounded-full" name="region"  >
                        <option value="LEC">LEC EUROPE</option>
                        <option value="LCK">LCK KOREA</option>
                        <option value="LPL">LPL CHINA</option>
                        <option value="LCS">LCS AMERICA</option>
                      </select>

                    </label>

                    <div className="md:col-span-3 mb-6">
                      <label className="uppercase text-white" htmlFor="startDate">START DATE</label>
                      <input onChange={
              (e) => { 
                const theval = e.target.value
                setNewLeaguedata({ ...newLeaguedata, startDate: dayjs(theval).toDate().toISOString() })
                console.log(newLeaguedata)
              }
            } type="date" name="startDate" id="startDate" className="h-10   text-gray-400 font-bold  mt-1 rounded px-4 w-full  bg-gray-light rounded-full"  placeholder="" />
                    </div>
                    <div className="md:col-span-3 mb-6">
                      <label className="uppercase text-white" htmlFor="endDate">end date</label>
                      <input onChange={(e) => {
              const theval = e.target.value
              setNewLeaguedata({ ...newLeaguedata, endDate: dayjs(theval).toDate().toISOString() })
              console.log(newLeaguedata)
            }} type="date" name="endDate" id="endDate" className="h-10   text-gray-400 font-bold  mt-1 rounded px-4 w-full  bg-gray-light rounded-full"  placeholder="" />
                    </div>
                    <div className="md:col-span-3 mb-6">
                      <label className="uppercase text-white" htmlFor="draftDate">Draft date</label>
                      <input onChange={
              (e) => {
                const theval = e.target.value
                setNewLeaguedata({ ...newLeaguedata, draftTime: dayjs(theval).toDate().toISOString() })
                console.log(newLeaguedata)
              }
            } type="date" name="draftDate" id="draftDate" className="h-10  text-gray-400 font-bold  mt-1 rounded px-4 w-full  bg-gray-light rounded-full"  placeholder="" />
                    </div>

                    <div className="md:col-span-2 mb-6">
                      <label className="uppercase text-white" htmlFor="maxPlayers">Max members</label>
                      <input onChange={
              (e) => { 
                const theval = e.target.value
                setNewLeaguedata({ ...newLeaguedata, maxPlayers: Number(theval) })
                console.log(newLeaguedata)
              }
            }  type="number" name="maxPlayers" id="maxPlayers" className="h-10  mt-1 rounded px-4 text-gray-400 w-full bg-gray-light rounded-full"  placeholder="" />
                    </div>
                    <div className="md:col-span-2 mb-6">
                      <label className="uppercase text-white" htmlFor="minPlayers">Min members</label>
                      <input onChange={
              (e) => { 
                const theval = e.target.value
                setNewLeaguedata({ ...newLeaguedata, minPlayers: Number(theval) })
                console.log(newLeaguedata)

              }
            } type="number" name="minPlayers" id="minPlayers" className="h-10  mt-1 rounded px-4 w-full text-gray-400  bg-gray-light rounded-full"  placeholder="" />
                    </div>

                    <div className="md:col-span-5 mb-6">
                      <div className="inline-flex items-center">

                        <div className="flex flex-col">
                          <span className="uppercase text-white">This is A buy-in League?</span>
                          <div className="flex flex-row">                        <input onChange={
              (e) => {
              
                setNewLeaguedata({ ...newLeaguedata, buyIn: "true" })
                console.log(newLeaguedata)
               }
            }  type="checkbox"  name="buyIn" id="buyIn" className="form-checkbox " />

                            <label htmlFor="true" className="ml-2 uppercase text-white">True</label></div>
                          <div className="flex flex-row"><input  onChange={
              (e) => {
              
                setNewLeaguedata({ ...newLeaguedata, buyIn: "false" })
                console.log(newLeaguedata)
               }
            }  type="checkbox" name="false" id="buyinTrue" className="form-checkbox " />
                            <label htmlFor="false" className="ml-2 uppercase text-white">False</label>
                          </div></div>
                      </div>
                    </div>
                    <div className="md:col-span-2 mb-6">
                      <label className="uppercase text-white" htmlFor="buyInfee">BuyInfee</label>
                      <input  onChange={
              (e) => {
                const theval = e.target.value
                setNewLeaguedata({ ...newLeaguedata, buyInFee: Number(theval) })
                console.log(newLeaguedata)
               }
            } type="number" name="buyInfee" id="buyInfee" placeholder="$1,000,000.00" className="h-10  mt-1 text-gray-400  rounded px-4 w-full  bg-gray-light rounded-full"  />
                    </div>
                    <div className="md:col-span-5 mb-6">
                      <div className="inline-flex items-center">

                        <div className="flex flex-col">
                          <span className="uppercase text-white">This League is Invite oNLY?</span>
                          <div className="flex flex-row">                        <input  onChange={
              (e) => { 
                
                setNewLeaguedata({ ...newLeaguedata, inviteOnly: "true" })
                console.log(newLeaguedata)
              }
            }type="checkbox" name="inviteOnlytrue" id="inviteOnly" className="form-checkbox" />

                            <label htmlFor="invitetrue" className="ml-2 uppercase text-white">True</label></div>
                          <div className="flex flex-row"><input onChange={
              (e) => { 
                
                setNewLeaguedata({ ...newLeaguedata, inviteOnly: "false" })
                console.log(newLeaguedata)
              }
            } type="checkbox" name="inviteOnlyfalse" id="billing_same" className="form-checkbox" />
                            <label htmlFor="invitefalse" className="ml-2 uppercase text-white">False</label>
                          </div></div>
                      </div>
                    </div>




                    <div className="md:col-span-5 text-left">
                      <div className="inline-flex items-end">
                        <button onClick={submitLeague} className="bg-gray-light hover:bg-gradient-to-r from-primary to-secondary hover:text-gray-dark text-white text-lg font-bold py-2 px-6 focus:outline rounded-full"><span>Submit</span></button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
      <div className="flex flex-col w-1/4 space-y-5 p-6"> <h2 className="font-semibold mb-6 text-3xl font-xix  bg-gradient-to-r from-primary via-[#f43d00] to-secondary bg-clip-text font-bold text-transparent">Create Fantasy League</h2> <div >
      
      <div className="flex flex-col space-y-5" >
        <div >
          <h1 className="text-primary">Rules</h1>
          <p className="text-gray-400">
            Find an in-depth list here of how all the points are calculated and how any exception to normal game circumstances are
            handled.
          </p>
        </div>

        <div>
          <h1 className="text-primary">FAQ</h1>
          <p className="text-gray-400">
            Find an in-depth list here of how all the points are calculated and how any exception to normal game circumstances are
            handled.
          </p>
        </div>
      </div>
    </div> </div>
    </div>

  </div>)
}


export default CreateLeague
