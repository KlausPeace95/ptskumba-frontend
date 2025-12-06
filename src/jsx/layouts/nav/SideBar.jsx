/// Menu
// import Metismenu from "metismenujs";
import React, { useReducer, useContext, useEffect, useState } from "react";
/// Scroll
import {Collapse} from 'react-bootstrap';
import { Link } from "react-router-dom";
import {MenuList} from './Menu';
import {useScrollPosition} from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import { AcademicService } from '../../../services/AcademicService';


const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active : "",
  activeSubmenu : "",
}

const SideBar = () => {
//  let d = new Date();
 const {
   iconHover,
   sidebarposition,
   headerposition,
   sidebarLayout,
   ChangeIconSidebar,
 } = useContext(ThemeContext);

 const [state, setState] = useReducer(reducer, initialState);
 const [counts, setCounts] = useState({});

 useEffect(() => {
   async function loadCounts(){
     try{
       const [departments, subjects, classrooms, classLevels, gradeLevels, classYears, streams, studentClasses] = await Promise.all([
         AcademicService.getDepartments().catch(()=>[]),
         AcademicService.getSubjects().catch(()=>[]),
         AcademicService.getClassrooms().catch(()=>[]),
         AcademicService.getClassLevels().catch(()=>[]),
         AcademicService.getGradeLevels().catch(()=>[]),
         AcademicService.getClassYears().catch(()=>[]),
         AcademicService.getStreams().catch(()=>[]),
         AcademicService.getStudentClasses().catch(()=>[]),
       ]);
       console.log('[Sidebar counts]', {
        departments, subjects, classrooms, classLevels, gradeLevels, classYears, streams, studentClasses
       });
       setCounts({
         Department: Array.isArray(departments)? departments.length: 0,
         Courses: Array.isArray(subjects)? subjects.length: 0,
         Classrooms: Array.isArray(classrooms)? classrooms.length: 0,
         'Class Levels': Array.isArray(classLevels)? classLevels.length: 0,
         'Grade Levels': Array.isArray(gradeLevels)? gradeLevels.length: 0,
         'Class Years': Array.isArray(classYears)? classYears.length: 0,
         Streams: Array.isArray(streams)? streams.length: 0,
         'Student Classes': Array.isArray(studentClasses)? studentClasses.length: 0,
       });
     }catch(e){
       console.debug('Sidebar counts error', e?.response?.data || e.message);
     }
   }
   loadCounts();
 }, []);

 useEffect(() => {
   var btn = document.querySelector(".nav-control");
   var aaa = document.querySelector("#main-wrapper");
    function toggleFunc() {
      return aaa.classList.toggle("menu-toggle");
   }
    btn.addEventListener("click", toggleFunc); 
 }, []);

   let handleheartBlast = document.querySelector('.heart');
   function heartBlast(){
     return handleheartBlast.classList.toggle("heart-blast");
   }

   const [hideOnScroll, setHideOnScroll] = useState(true)
   useScrollPosition(
     ({ prevPos, currPos }) => {
       const isShow = currPos.y > prevPos.y
       if (isShow !== hideOnScroll) setHideOnScroll(isShow)
     },
     [hideOnScroll]
   )
 
  
  const handleMenuActive = status => {		
      setState({active : status});			
      if(state.active === status){				
        setState({active : ""});
      }   
   }
   const handleSubmenuActive = (status) => {		
     setState({activeSubmenu : status})
     if(state.activeSubmenu === status){
       setState({activeSubmenu : ""})			
     }    
   }
  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];
  /// Active menu

     
  useEffect(() => {
    MenuList.forEach((data) => {
      data.content?.forEach((item) => {        
        if(path === item.to){         
          setState({active : data.title})          
        }
        item.content?.forEach(ele => {
          if(path === ele.to){
            setState({activeSubmenu : item.title, active : data.title})
          }
        })
      })
  })
  },[path]);
 
  return (
      <div
        onMouseEnter={()=>ChangeIconSidebar(true)}
        onMouseLeave={()=>ChangeIconSidebar(false)}
        className={`dlabnav ${iconHover} ${
          sidebarposition.value === "fixed" &&
          sidebarLayout.value === "horizontal" &&
          headerposition.value === "static"
            ? hideOnScroll > 120
              ? "fixed"
              : ""
            : ""
        }`}
      >
         <div className="dlabnav-scroll">           
            <ul className="metismenu" id="menu">
              {MenuList.map((data, index)=>{
                let menuClass = data.classsChange;
                  if(menuClass === "menu-title"){
                    return(
                      <li className={menuClass}  key={index} >{data.title}</li>
                    )
                  }else{
                    return(				
                      <li className={`${ state.active === data.title ? 'mm-active' : ''} `} key={index} >                        
                        {data.content && data.content.length > 0 ?
                            <>
                              <Link to={"#"} 
                                className="has-arrow"
                                onClick={() => {handleMenuActive(data.title)}}
                              >								
                                  {data.iconStyle}
                                  <span className="nav-text">{data.title}</span>
                                  <span className="ms-1 badge badge-xs style-1 badge-danger">{counts[data.title] ?? data.update}</span>
                              </Link>
                              <Collapse in={state.active === data.title ? true :false}>
                                  <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                    {data.content && data.content.map((data,index) => { 										
                                      return(	
                                          <li key={index}
                                            className={`${ state.activeSubmenu === data.title ? "mm-active" : ""}`}                                    
                                          >
                                            {data.content && data.content.length > 0 ?
                                                <>
                                                  <Link to={data.to} className={data.hasMenu ? 'has-arrow' : ''}
                                                      onClick={() => { handleSubmenuActive(data.title)}}
                                                  >
                                                    {data.title}
                                                  </Link>
                                                  <Collapse in={state.activeSubmenu === data.title ? true :false}>
                                                      <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                                        {data.content && data.content.map((data,index) => {
                                                          return(	
                                                            
                                                            <li key={index}>
                                                              <Link className={`${path === data.to ? "mm-active" : ""}`} to={data.to}>{data.title}</Link>
                                                            </li>
                                                            
                                                          )
                                                        })}
                                                      </ul>
                                                  </Collapse>
                                                </>
                                              :
                                              <Link to={data.to} className={`${data.to === path ? 'mm-active' : ''}`} >
                                                {data.title}
                                              </Link>
                                            }                                            
                                          </li>                                        
                                      )
                                    })}
                                  </ul>
                                </Collapse>
                            </>
                        :
                          <Link to={data.to} className={`${data.to === path ? 'mm-active' : ''}`}>
                              {data.iconStyle}
                              <span className="nav-text">{data.title}</span>
                          </Link>
                        }
                        
                      </li>	
                    )
                }
              })}          
          </ul>	
        
            <div className="copyright">
              <p><strong>School Admission Dashboard</strong></p>
              <p className="fs-12">Made with <span className="heart" onClick={heartBlast}></span> by DexignLab</p>
            </div>
          </div>
      </div>
    );
};

export default SideBar;
