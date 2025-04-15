import { ExpenseTrackerData } from "../types/types";

export const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

export const hoverActiveAnim = "hover:scale-105 active:scale-95 transition-all"

export function copyData(savedData: ExpenseTrackerData) {
    if (savedData) {
        navigator.clipboard.writeText(JSON.stringify(savedData)).then(() => {
            alert('Dane skopiowane do schowka.')
        }).catch(err => {
            alert('Błąd podczas kopiowania danych.')
            console.error('Błąd podczas kopiowania danych: ', err);
        });
    }
}

export function pasteData() {
    navigator.clipboard.readText().then(value => {
        localStorage.setItem("ExpenseTracker", value);
        alert("Dane zostały zapisane.")
    }).catch(err => {
        console.error('Błąd podczas zapisywania danych: ', err);
        alert("Błąd podczas zapisywania danych.")
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