// EditComplaintForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditComplaintForm({ complaint, onEditComplete }) {
    const [formData, setFormData] = useState({
        UserName: '',
        UserDepartment: '',
        UserLocation: '',
        ProblemDescription: '',
        ResolvedOn: '',
        Remark: '',
    });

    // Load the complaint data when the component mounts
    useEffect(() => {
        if (complaint) {
            setFormData({
                UserName: complaint.UserName || '',
                UserDepartment: complaint.UserDepartment || '',
                UserLocation: complaint.UserLocation || '',
                ProblemDescription: complaint.ProblemDescription || '',
                ResolvedOn: complaint.ResolvedOn || '',
                Remark: complaint.Remark || '',
            });
        }
    }, [complaint]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make a PUT request to update the complaint on the server
            const response = await axios.put(`http://192.168.43.166:5050/complaints/${complaint._id}`, formData);
            if (response.status === 200) {
                alert('Complaint updated successfully!');
                onEditComplete(); // Exit editing mode
            }
        } catch (error) {
            alert('Failed to update complaint. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h2>Edit Complaint</h2>
            <form onSubmit={handleSubmit} className="complaint-form">
                <div className="form-group">
                    <label>User Name</label>
                    <input
                        type="text"
                        name="UserName"
                        value={formData.UserName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>User Department</label>
                    <input
                        type="text"
                        name="UserDepartment"
                        value={formData.UserDepartment}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>User Location</label>
                    <input
                        type="text"
                        name="UserLocation"
                        value={formData.UserLocation}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Problem Description</label>
                    <textarea
                        name="ProblemDescription"
                        value={formData.ProblemDescription}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Resolved On</label>
                    <input
                        type="datetime-local"
                        name="ResolvedOn"
                        value={formData.ResolvedOn}
                        onChange={handleInputChange}
                    />
                </div>
                
                <div className="form-group">
                    <label>Remark</label>
                    <input
                        type="text"
                        name="Remark"
                        value={formData.Remark}
                        onChange={handleInputChange}
                    />
                </div>
                
                <button type="submit" className="submit-button">Update Complaint</button>
            </form>
        </div>
    );
}

export default EditComplaintForm;
