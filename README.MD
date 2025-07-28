# Git Scanner

Git Scanner הוא כלי המאפשר סריקה ואנליזה של מאגרי Git לצרכים שונים, כגון איתור שינויים, ניתוח היסטוריית קומיטים, או בדיקת קונפיגורציות.

## תיאור

כלי זה נועד לספק דרך פשוטה ויעילה לסרוק מאגרי Git, להפיק מידע רלוונטי, ולעזור למפתחים ולמנהלי מערכות לקבל החלטות מבוססות על נתוני היסטוריית הקוד.

## התקנה

כדי להתקין את Git Scanner, יש לבצע את השלבים הבאים:

1. וודא שיש לך Python 3.7 ומעלה מותקן במערכת.
2. הורד את קוד המקור מהמאגר.
3. התקן את התלויות באמצעות הפקודה:

```
pip install -r requirements.txt
```

## שימוש

להריץ את הכלי, השתמש בפקודה הבאה:

```
python git_scanner.py [options]
```

אפשרויות נפוצות:

- `--repo PATH` – נתיב למאגר Git לסריקה.
- `--output FILE` – קובץ לפלט התוצאות.
- `--help` – הצגת עזרה.

## הערות

- ודא שהנתיב למאגר Git תקין ושהמשתמש בעל הרשאות קריאה.
- הכלי תומך רק במאגרי Git מקומיים.

## רישיון

Git Scanner מופץ תחת רישיון MIT. עיין בקובץ LICENSE למידע נוסף.

# Git Scanner CLI Tool

Git Scanner is a command-line utility for scanning and analyzing local Git repositories. It helps developers and system administrators gain insights into repository history, detect changes, and generate reports based on repository data.

## Description

Git Scanner provides an efficient way to extract information from Git repositories, such as commit history, file changes, and configuration analysis. It is designed to assist in making informed decisions based on codebase history and repository structure.

## Installation

To install Git Scanner, follow these steps:

1. Ensure you have Python 3.7 or higher installed on your system.
2. Clone or download the source code from this repository.
3. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

## Usage

Run the tool using the following command:

```bash
python git_scanner.py [options]
```

### Common Options

- `--repo PATH` &nbsp;&nbsp;&nbsp;&nbsp;Path to the local Git repository to scan.
- `--output FILE` &nbsp;File to write the scan results.
- `--help` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Show help message and available options.

## Notes

- Ensure the provided repository path is valid and that you have read permissions for the repository.
- Git Scanner supports scanning only local Git repositories (not remote URLs).

## License

Git Scanner is released under the MIT License. See the [LICENSE](LICENSE) file for more information.
