import { useState } from "react";
import Mapes from "./Mapes"; 
import "./Search.css";
import { useForm } from 'react-hook-form';

export default function Search() {

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [adress, setAdress] = useState("");  // משתנה לכתובת שהמשתש הכניס
    const [query, setQuery] = useState([]);    // איחסון תוצאת החיפוש
    const [location, setLocation] = useState("בני ברק"); //המיקום שנבחר  מאותחל בהתחלה לבני ברק
    const [showMap, setShowMap] = useState(false); //האם להציג את המפה-כדי שתוצג כשמקליד כתובת
    
    function addressFetch(adress) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${adress}&limit=5`)
            .then(res => res.json())
            .then(data => {
                setQuery(data);  // מעדכן את תוצאות החיפוש 
                if (data.length > 0) {
                    // אם נמצאה תוצאה שומר את התוצאה הראשונה
                    setLocation([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                    setShowMap(true);  // מציג את המפה
                } else {
                    setShowMap(false); // אם אין תוצאות-מסתיר את המפה
                }
            })
            .catch(err => console.log(err)); 
    };

    function chandeAddress(e) {
        const newAdress = e.target.value;  // הערך החדש של שדה הקלט
        setAdress(newAdress);  // עידכון הכתובת עם הכתובת החדשה שהוקלדה

        if (newAdress.length >= 3) {  // רק אם הכתובת מעל 3 תווים מעדכן את הכתובת החדשה
            addressFetch(newAdress);
        } else {
            setShowMap(false); // מסתיר את המפה אם הכתובת קצרה מדי
        }
    }
    //הדפסה\עידכון שנשמרו הפרטים והדפסת הפרטים שנשלחו בטופס לקונסול
    function onSubmit(data) {
        console.log("טופס נשלח בהצלחה עם הנתונים:", data);
        alert("הטופס נשמר בהצלחה!");
        reset(); // איפוס השדות לאחר שליחת הטופס
        setAdress(""); // איפוס כתובת
        setQuery([]);  // איפוס הצעות
        setShowMap(false); // הסתרת המפה
    }

    return (
        <div className="formContainer">
             {/* טופס דינמי עם תקינות, המאפשר איסוף פרטי משתמש, חיפוש כתובת עם הצעות מבוססות API, והצגת מפה בהתאם לבחירה.*/}
            <form className="form-add" onSubmit={handleSubmit(onSubmit)}>
            <input {...register("userName", {required: "שם משתמש הוא שדה חובה", minLength: { value: 3, message: "שם משתמש חייב להיות לפחות 3 תווים" }})} type="text"/>
                {errors.userName && <p className="error">{errors.userName.message}</p>}
                
                <label>כתובת</label>
                <input {...register("adress", { required: "כתובת היא שדה חובה", minLength: { value: 3, message: "כתובת חייבת להכיל לפחות 3 תווים" } })} type="text" value={adress} onChange={chandeAddress} />
                {errors.adress && <p className="error">{errors.adress.message}</p>}
                <ul>
                    {query.length > 0 && query.map((item, index) => (
                        <button  key={index}  onClick={(e) => { e.preventDefault(); 
                        setAdress(item.display_name); 
                        setValue("adress", item.display_name);
                         setQuery([]);  }} >
                            {item.display_name}
                        </button>
                    ))}
                </ul>

                <label>טלפון</label>
                <input {...register("tel", { required: "טלפון הוא שדה חובה",  pattern: { value: /^[0-9]{9,10}$/, message: "מספר טלפון לא תקין" } })}  type="text"/>
                {errors.tel && <p className="error">{errors.tel.message}</p>}

                <label>מייל</label>
                 <input {...register("email", {  required: "מייל הוא שדה חובה", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "מייל לא תקין" }})}  type="email"/>
                {errors.email && <p className="error">{errors.email.message}</p>}


                <label>האם נדרש חיבור לאינטרנט</label>
                <input {...register("internetConectionNeeded")} type="checkbox" />

                <label>האם נדרש מטבח</label>
                <input {...register("kitchenNeeded")} type="checkbox" />

                <label>האם נדרשת מכונת קפה</label>
                <input {...register("CoffeeMachinNeeded")} type="checkbox" />

                <label>מספר חדרים</label>
                <input  {...register("numOfRooms", { required: "מספר חדרים הוא שדה חובה", min: { value: 1, message: "מספר חדרים חייב להיות לפחות 1" }})} type="number" />
                {errors.numOfRooms && <p className="error">{errors.numOfRooms.message}</p>}


                <label>מרחק מקסימלי</label>
                <input {...register("maxDistance", { required: "מרחק מקסימלי הוא שדה חובה",  min: { value: 1, message: "מרחק מקסימלי חייב להיות לפחות 1 ק״מ" } })} type="number" />
                {errors.maxDistance && <p className="error">{errors.maxDistance.message}</p>}


                <label>סטטוס</label>
                <input {...register("status", { required: "סטטוס הוא שדה חובה" })} type="text" />
                {errors.status && <p className="error">{errors.status.message}</p>}

                <input type="submit" value="שלח" />
            </form>

            
            {/*Mapes המפה-שליחה לקומפוננטת */}
            <div className="mapes">
                {showMap && location && <Mapes location={location} />}
            </div>
        </div>
    );
}