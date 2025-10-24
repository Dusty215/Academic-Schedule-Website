Accessibility Report: University Course Schedule

This document outlines the accessibility features implemented in the course-schedule.html page, ensuring compliance with WCAG (Web Content Accessibility Guidelines).

1. Semantic HTML Structure

The table is built using proper semantic HTML to ensure screen readers can parse and navigate the content correctly.

<table>, <thead>, <tbody>, <tfoot>: The table is correctly partitioned into a header, body, and footer. This allows screen readers to understand the data structure and provide shortcuts to the user.

<caption>: A detailed caption (<caption>Fall 2025 Course Schedule: University Departments</caption>) is provided immediately after the <table> tag. This describes the table's purpose to all users.

<th> for Headers: All column headers (Course Name, Course Code, etc.) are defined using <th> tags.

2. Header scope Attributes

To programmatically associate data cells with their corresponding headers, scope attributes are used extensively:

scope="col": All headers in the <thead> (e.g., "Course Name", "Time") are given scope="col" to indicate they are headers for their entire column.

scope="row": The primary "key" for each row (the Course Name, e.g., "Web Application Development") is placed in a <th> tag with scope="row". This tells the screen reader that this cell is the header for all other cells in that row.

3. rowspan Implementation

The schedule uses rowspan to group multiple time slots for a single course (e.g., CYB 325 has two rows of data).

The scope="row" header (e.g., "Web Application Development") correctly spans both rows, creating a clear association.

This structure allows a screen reader user to navigate row by row and understand that "Monday" and "9:00 AM - 10:15 AM" are still part of the "Web Application Development" course.

The data-group attribute, while used for scripting, also helps ensure that related rows are always handled as a single unit.

4. Color and Contrast

The design avoids relying on color alone to convey information and adheres to a high-contrast, grayscale theme.

Grayscale Theme: The schedule uses only shades of gray and black on a white background, ensuring high contrast.

High-Contrast Input: The "Filter Schedule" input field is explicitly styled with a white background (#ffffff) and dark text (#333) to guarantee high contrast and override any conflicting browser extensions (like dark mode).

No Color-Only Information: Information is conveyed through text. For example, course codes (e.g., CYB, STAT) are present in text, not just indicated by a color.

5. Keyboard Navigation & Focus

tabindex="0": Each <tr> in the table body has tabindex="0". This makes the entire row focusable, allowing keyboard-only users to navigate the schedule line by line using the Tab key.

Focus Indicators: A clear visual outline (outline: 2px solid #666;) is applied when a row is focused, making keyboard navigation predictable.

Interactive Elements: The filter input and sortable column headers are all keyboard-accessible and have clear focus states.