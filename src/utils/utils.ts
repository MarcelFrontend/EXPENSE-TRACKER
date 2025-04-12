import { ExpenseTrackerData } from "../types/types";

export const monthNames = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];

export function copyData(savedData: ExpenseTrackerData) {
    if (savedData) {
        navigator.clipboard.writeText(JSON.stringify(savedData)).then(() => {
            console.log('Dane skopiowane do schowka!');
        }).catch(err => {
            console.error('Błąd podczas kopiowania danych: ', err);
        });
    }
}

export function pasteData() {
    navigator.clipboard.readText().then(value => {
        localStorage.setItem("ExpenseTracker", value);
        console.log('Dane zostały dodane do localStorage:', JSON.parse(value));
    }).catch(err => {
        console.error('Błąd podczas wklejania danych: ', err);
    });
}

export function deleteData() {
    if (confirm("Wyczyścisz wszystkie dane, czy chcesz kontynuować?")) {
        localStorage.removeItem("ExpenseTracker");
        window.location.reload()
    } else {
        alert("Dane zachowano")
    }
}