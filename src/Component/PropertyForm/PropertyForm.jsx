import React, { useState, useEffect, useRef } from "react";
import { propertiesListing, updateProperty, propertyListingRequest } from "../../../Api/api";
import Toast from "../Toast/Toast";
import "./PropertyForm.css";

const PropertyForm = ({ initialData, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        username: "",
        propertyName: "",
        propertyPrice: "",
        propertyDescription: "",
        propertyLocation: "",
        propertyBedType: "",
        propertyGuestPaxNo: "",
        propertyImage: [],
    });
    const [removedImages, setRemovedImages] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {

        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setFormData((prev) => ({
                ...prev,
                username: storedUsername, // pre-fill the username field from localStorage
            }));
        }
        if (initialData) {
            setFormData({
                username: initialData.username || "",
                propertyName: initialData.propertyName || "",
                propertyPrice: initialData.propertyPrice || "",
                propertyDescription: initialData.propertyDescription || "",
                propertyLocation: initialData.propertyLocation || "",
                propertyBedType: initialData.propertyBedType || "",
                propertyGuestPaxNo: initialData.propertyGuestPaxNo || "",
                propertyImage: initialData.propertyImage || [],
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            propertyImage: [...prev.propertyImage, ...newFiles],
        }));
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => {
            const updatedImages = [...prev.propertyImage];
            const removedImage = updatedImages.splice(index, 1)[0];
            if (!(removedImage instanceof File)) {
                setRemovedImages((prevRemoved) => [...prevRemoved, removedImage]);
            }
            return { ...prev, propertyImage: updatedImages };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("username", formData.username);
        data.append("propertyName", formData.propertyName);
        data.append("propertyPrice", formData.propertyPrice);
        data.append("propertyDescription", formData.propertyDescription);
        data.append("propertyLocation", formData.propertyLocation);
        data.append("propertyBedType", formData.propertyBedType);
        data.append("propertyGuestPaxNo", formData.propertyGuestPaxNo);

        // Only include propertyStatus when creating a new property
        if (!initialData) {
            data.append("propertyStatus", "Pending");
        }

        formData.propertyImage.forEach((file) => {
            if (file instanceof File) {
                data.append("propertyImage", file);
            }
        });

        data.append("removedImages", JSON.stringify(removedImages));

        try {
            let response;
            if (initialData) {
                response = await updateProperty(data, initialData.propertyID);
            } else {
                const response = await propertiesListing(data);
                const { propertyID } = response;

                await propertyListingRequest(propertyID);
            }

            if (response && response.message) {
                setToastMessage(response.message);
                setToastType("success");
                setShowToast(true);
            }

            setFormData({
                username: "",
                propertyName: "",
                propertyPrice: "",
                propertyDescription: "",
                propertyLocation: "",
                propertyBedType: "",
                propertyGuestPaxNo: "",
                propertyImage: [],
            });
            setRemovedImages([]);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            if (onSubmit) {
                onSubmit();
            }
        } catch (error) {
            setToastMessage(`Error: ${error.message}`);
            setToastType("error");
            setShowToast(true);
        }
    };

    const handleOverlayClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="property-form-overlay" onClick={handleOverlayClick}>
            <div className="property-form-content" onClick={(e) => e.stopPropagation()}>
                <h1>{initialData ? "Edit Property" : "Create a New Property"}</h1>
                <button onClick={onClose} className="property-form-close-button">×</button>
                <form onSubmit={handleSubmit} className="property-listing-form">
                    <div className="property-listing-form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            readOnly
                            required
                        />
                    </div>
                    <div className="property-listing-form-group">
                        <label>Property Name:</label>
                        <input
                            type="text"
                            name="propertyName"
                            value={formData.propertyName}
                            onChange={handleChange}
                            placeholder="e.g. Property"
                            required
                        />
                    </div>
                    <div className="property-listing-form-group">
                        <label>Property Price:</label>
                        <input
                            type="number"
                            name="propertyPrice"
                            value={formData.propertyPrice}
                            onChange={handleChange}
                            placeholder="e.g. 123.12"
                            required
                        />
                    </div>
                    <div className="property-listing-form-group">
                        <label>Guest Capacity:</label>
                        <input
                            type="text"
                            name="propertyGuestPaxNo"
                            value={formData.propertyGuestPaxNo}
                            onChange={handleChange}
                            placeholder="e.g. 2 Adults 2 Kids"
                            required
                        />
                    </div>
                    <div className="property-listing-form-group">
                        <label>Bed Type:</label>
                        <input
                            type="text"
                            name="propertyBedType"
                            value={formData.propertyBedType}
                            onChange={handleChange}
                            placeholder="1 King 1 Queen"
                            required
                        />
                    </div>
                    <div className="property-listing-form-group">
                        <label>Property Location:</label>
                        <input
                            type="text"
                            name="propertyLocation"
                            value={formData.propertyLocation}
                            onChange={handleChange}
                            placeholder="e.g. No.123, LOT 1234, Lorong 1, Jalan ABC, Kuching, Sarawak"
                            required
                        />
                    </div>
                    <div className="property-listing-form-group full-width">
                        <label>Property Description:</label>
                        <textarea
                            name="propertyDescription"
                            value={formData.propertyDescription}
                            onChange={handleChange}
                            placeholder="e.g. This Property Has Good View"
                            required
                        />
                    </div>
                    <div className="property-listing-form-group full-width">
                        <label>Property Image:</label>
                        <input
                            type="file"
                            name="propertyImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            multiple
                        />
                    </div>
                    <div className="existing-images-container">
                        {formData.propertyImage.map((image, index) => (
                            <div key={index} className="image-item">
                                {image instanceof File ? (
                                    <img src={URL.createObjectURL(image)} alt="Property" />
                                ) : (
                                    <img src={`data:image/jpeg;base64,${image}`} alt="Property" />
                                )}
                                <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="property-listing-submit-button">
                        {initialData ? "Update Property" : "Create Property"}
                    </button>
                </form>

                {showToast && <Toast type={toastType} message={toastMessage} />}
            </div>
        </div>
    );
};

export default PropertyForm;
