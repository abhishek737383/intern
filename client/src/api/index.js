import axios from "axios";

const API=axios.create({
    baseURL:"https://intern-dyia.onrender.com"
});

API.interceptors.request.use((req)=>{
    if(localStorage.getItem("Profile")){
        req.headers.Authorization=`Bearer ${
            JSON.parse(localStorage.getItem("Profile")).token
        }`;
    }
    return req;
})

export const login=(authdata)=>API.post("user/login",authdata);
export const signup=(authdata)=>API.post("user/signup",authdata);
export const getallusers=()=> API.get("/user/getallusers");
export const updateprofile=(id,updatedata)=>API.patch(`user/update/${id}`,updatedata)


export const postquestion=(questiondata)=>API.post("/questions/Ask",questiondata);
export const getallquestions=()=>API.get("/questions/get");
export const deletequestion=(id)=>API.delete(`/questions/delete/${id}`);
export const votequestion=(id,value)=>API.patch(`/questions/vote/${id}`,{value});
export const voteanswer = (questionId, answerId, value) =>API.patch(`/answer/vote/${questionId}`, { answerId, value });


export const postanswer=(id,noofanswers,answerbody,useranswered,userid)=>API.patch(`/answer/post/${id}`,{noofanswers,answerbody,useranswered,userid});
export const deleteanswer=(id,answerid,noofanswers)=>API.patch(`/answer/delete/${id}`,{answerid,noofanswers});

// reward APIs
export const addPoints = (userId, points) => API.patch(`/user/addpoints/${userId}`, { points });
export const reducePoints = (userId, points) => API.patch(`/user/reducepoints/${userId}`, { points });
export const transferPoints = (fromUserId, toUserId, points) =>API.post(`/user/transferpoints`, { fromUserId, toUserId, points });
