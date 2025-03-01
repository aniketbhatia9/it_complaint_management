import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'; // Import Axios
import './App.css';

export default function ComplaintForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    // Function to handle form submission
    const onSubmit = async (data) => {
      try {
          // Get the token from local storage (or however you're storing it)
          const token = localStorage.getItem('token'); // Adjust as per your implementation
  
          const response = await axios.post('http://172.16.2.210:5050/complaints', data, {
              headers: {
                  Authorization: `Bearer ${token}` // Send the token in the Authorization header
              }
          });
          console.log(response.data);
          alert('Complaint submitted successfully!');
      } catch (error) {
          console.error('Error submitting complaint:', error);
          alert('Failed to submit complaint. Please try again.');
      }
  };
  
    
  
    return (  
        
        <div className="form-container">
            <h2>IT Complaint Form</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="complaint-form">
                <div className="form-group">
                    <label>User Name</label>
                    <input type="text" {...register("UserName", { required: true })} />
                    {errors.UserName && <span className="error">This field is required</span>}
                </div>
                
                <div className="form-group">
                    <label>User Department</label>
                    <input type="text" {...register("UserDepartment", { required: true })} />
                    {errors.UserDepartment && <span className="error">This field is required</span>}
                </div>
                
                <div className="form-group">
                    <label>User Location</label>
                    <input type="text" {...register("UserLocation", { required: true })} />
                    {errors.UserLocation && <span className="error">This field is required</span>}
                </div>
                
                <div className="form-group">
                    <label>Problem Description</label>
                    <textarea {...register("ProblemDescription", { required: true })} />
                    {errors.ProblemDescription && <span className="error">This field is required</span>}
                </div>
                
                <div className="form-group">
                    <label>Resolved On</label>
                    <input type="datetime-local" {...register("ResolvedOn")} />
                </div>
                
                <div className="form-group">
                    <label>Remark</label>
                    <input type="text" {...register("Remark")} />
                </div>               

                <button type="submit">Submit</button>
            </form>
        </div>
        
    );
}
