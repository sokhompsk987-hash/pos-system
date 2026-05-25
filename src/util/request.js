import axios from "axios"
import config from "./config";
import { profileStore } from "../store/profileStore";
 
export const request = (url="",method="",data={}) => {
    const {token} = profileStore.getState(); //.getState() used for js and uesd for get state in to globle state
    let headers = {"Content-Type" : "application/json"};
    //check raw data or form data
    if (data instanceof FormData){ //check form data
        headers = {"Content-Type" : "multipart/form-data"};
    }
    return axios({
        url : config.base_url + url,
        method : method,
        data : data,
        headers : {
            Accept : "application/json",
            ...headers,
            Authorization : "Bearer "+token
        }
    }).then(res => {
        return res.data
    }).catch(error => {
        let response = error.response;
        if (response){
            const status = response.status;
            let data = response.data;
            console.log(error);
            let errors = {}
            if (data.errors){
                Object.keys(data.errors).map((key) => {
                    errors[key] = {//add new property object
                        validateStatus : "warning" ,
                        help : data.errors[key][0] ,
                        hasFeedback : true
                    }
                })
            }
            switch(status)  {
                case 422 :
                    return {
                        "data" : data,
                        "errors" : errors
                    }
                case 500:
                    return {
                        "errors" : response.statusText,
                        "data" : {
                            "message" : response.statusText
                        }
                    }
                case 401:
                    return {
                        "data" : data,
                        "errors" : response.statusText
                    }
                case 403:
                    return {
                        "data" : data,
                        "errors" : response.statusText
                    } 
                case 409:
                    return {
                        "data" : data,
                        "errors" : errors
                    }
                case 404:
                    return {
                        "data" : data,
                        "errors" : errors
                    }
                case 400:
                    return {
                        "data" : data,
                        "errors" : errors
                    }
            }
        }
    })
}