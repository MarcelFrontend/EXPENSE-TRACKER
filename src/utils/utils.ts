import { ExpenseTrackerData } from "../types/types";

export const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

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
        try {
            JSON.parse(value)
            localStorage.setItem("ExpenseTracker", value);
            alert("Dane zostały zapisane.")
        } catch (error) {
            console.error("Błąd:",error);
            alert("Nieprawidłowy format danych.")
        }
    }).catch(err => {
        console.error('Błąd podczas zapisywania danych: ', err);
        alert("Błąd dostępu do schowka.")
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