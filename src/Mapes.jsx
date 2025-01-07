import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function Mapes({ location }) {
    // שמירה על המפה כדי לא לטעון אותה מחדש בכל פעם
    const mapRef = useRef(null);

    useEffect(() => {
        // אם יש מיקום ממה שהגיעה בפרופס בפרופס
        if (location) {
            const [height, width] = location; // מוציאים את האורך הרוחב מתוך המערך

            // אם המפה עוד לא נוצרה
            if (!mapRef.current) {
                // יוצרים מפה חדשה ושמים אותה לפי המיקום
                mapRef.current = L.map('map').setView([height, width], 13);

                // רקע המפה
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(mapRef.current);
            } else {
                // אם המפה כבר קיימת, רק מעדכנים את המיקום
                mapRef.current.setView([height, width], 13);
            }

            // מוסיפים סמן במקום החדש עם טקסט שמתאר את המיקום
            L.marker([height, width]).addTo(mapRef.current)
                .bindPopup('המיקום שלך') 
                .openPopup(); //הטקסט יפתח אוטומטי
        }
    }, [location]); // מפעיל את הקוד מחדש כשהמיקום משתנה

    return (
      //מחזירים מקומוננטה זו את המפה
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
    );
}