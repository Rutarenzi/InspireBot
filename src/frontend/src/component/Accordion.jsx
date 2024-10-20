import React, {useState,useEffect} from 'react';
import { styled } from '@mui/material/styles';
import  ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { 
  Typography,
  Box
 }from '@mui/material';
 import MuiAccordionSummary from "@mui/material/AccordionSummary"
 import MuiAccordion from "@mui/material/Accordion"
 import  MuiAccordionDetails from "@mui/material/AccordionDetails"
import TotalAvatars from './Avators';
import Add from "./Add"
import Chips from './Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import { contribute, deleteContribution, getMyBusiness } from '../utils/endpoints';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: '#f6f9fc',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: '#f6f9fc',
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid #f6f9fc',
}));

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = useState(" ");
  const [MybusinessIdea, setMybusinessIdea] = useState([]);
  const [inputIdea, setInputIdea ] = useState();
  const [error,setError] = useState()

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  useEffect(async()=>{
     const GetMyBusiness=async()=>{
     const ideas = await getMyBusiness();
     if(ideas.Ok){
      setMybusinessIdea(ideas.Ok)
      setError(" ")
     }else if(ideas.Err){
      setError(ideas.Err)
     }
     
     }
     await GetMyBusiness()
  },[getMyBusiness])

  // delete function
 const deletor=async(businessId,contributeId)=>{
 await deleteContribution(businessId,contributeId) 
}
const submit=async(e)=>{
  e.preventDefault();
  const  content  = e.target[0].value;
  const businessId = e.target[1].value;
  if(inputIdea){
    await contribute(businessId,content);
  }
}

  return (
    <div>
     {MybusinessIdea?
    (MybusinessIdea.map((Ideas, index)=>(
      <Accordion expanded={expanded === `${Ideas.id}`} key={Ideas.id} onChange={handleChange(Ideas.id)} 
      sx={{borderRadius: "8px", marginBottom:"15px"}}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
         
              <Box>
              <Box sx={{display:"flex",justifyContent:"space-between", 
                marginBottom: "20px"}}>
                <Box><Chips name={index+1} /></Box>
                <Typography>{Ideas.createdAt}</Typography>
              </Box>
              
              <Box>
              <Typography sx={{marginBottom:"10px", fontWeight:"bold"}}>
                USER PROMPT
                </Typography>
                 <Typography>
                  {Ideas.promptIdea}
                 </Typography>
          </Box>
              </Box>
        </AccordionSummary>
        <AccordionDetails >
         <Box sx={{overflowY:"scroll", height: "60vh"}}>
        
         <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px"}}>
            <Add BusinessId={Ideas.id}/>
            <TotalAvatars contributors={Ideas.contributors}/>
        </Box>
       
        <Box>
        <Typography sx={{marginBottom:"10px", fontWeight:"bold"}}>
                AI RESPONSE
        </Typography>

            <Typography>
            {Ideas.aiIdea}
             </Typography>
        </Box>
        <Box sx={{display:"flex", justifyContent:"space-between", marginTop: "40px"}}>
              <form className="Form" onSubmit={submit}>
                 <textarea 
                   className="textArea"
                   placeholder="Suggest what to change or add "
                   value={inputIdea}
                   name="content"
                   onChange={(e) => setInputIdea(e.target.value)}
                 />
                  <input type="hidden" value={Ideas.id} name="businessId"/>
                 <button type="submit" className="buttonComment">
                     Contribute
                 </button>
              </form>
        </Box>
         {Ideas.contributions?.map((contribution)=>(
           <Box sx={{marginTop:"20px", marginBottom:"20px",
             boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
             padding: "14px"
             
            }} 
            key={contribution.contrId}
            >
              <Box sx={{display:"flex", justifyContent:"space-between", marginBottom:"10px"}} >
               <Typography sx={{padding: "4px 16px", background:"grey", borderRadius: "8px", color: "white"}}>{contribution.email}</Typography>
               <Typography>{contribution.createdAt}</Typography>
              </Box>
              <Typography>
                 {contribution.content}
              </Typography>
              <Box><button className="DeleteBtn" onClick={()=>{deletor(Ideas.id,contribution.contrId)}}><DeleteIcon/></button></Box>
           </Box> 
         ))}  
         </Box>
        </AccordionDetails>
      </Accordion>
    ))):(<p>NO Business idea</p>) 
    }
    </div>
  );
}
