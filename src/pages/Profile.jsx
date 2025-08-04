import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserProvider";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import defaultAvatar from "../images/default-avatar.png";

const Profile = () => {
    const { userEmail } = useContext(UserContext);
    const [profileImage, setProfileImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const storageRef = ref(storage, `profiles/${userEmail}`);
                const url = await getDownloadURL(storageRef);
                setImageUrl(url);
            } catch (err) {
                console.error("Failed to fetch profile image", err);
                setImageUrl(defaultAvatar);
            }
        };
        if (userEmail) fetchProfileImage();
    }, [userEmail]);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!profileImage || !userEmail) return;

        const imageRef = ref(storage, `profiles/${userEmail}`);
        await uploadBytes(imageRef, profileImage);
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
        alert("Profile picture updated!");
    };

    return (
        <div className="container text-center mt-5">
            <h2>My Profile</h2>
            <img
                src={imageUrl}
                alt="Profile"
                style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "50%" }}
                className="mb-3"
            />
            <p><strong>Email:</strong> {userEmail}</p>
            <div className="mb-3">
                <input type="file" onChange={handleImageChange} />
            </div>
            <button className="btn btn-primary" onClick={handleUpload}>Upload New Picture</button>
        </div>
    );
};

export default Profile;
