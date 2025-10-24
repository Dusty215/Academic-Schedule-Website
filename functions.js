document.addEventListener('DOMContentLoaded', function () {
    
    // --- SETUP: BUILD GROUPS ---
    // This is the key: We build a 'groups' object that understands
    // which rows belong to which course.
    
    const scheduleBody = document.getElementById('schedule-body');
    const allRows = Array.from(scheduleBody.getElementsByTagName('tr'));
    const groups = {}; // Key = groupName (e.g., 'cyb325'), Value = { rows: [], mainRow: null, fullText: '' }
    const rowsWithoutGroup = []; // Failsafe

    allRows.forEach(row => {
        const groupName = row.dataset.group;
        if (groupName) {
            if (!groups[groupName]) {
                groups[groupName] = { rows: [], mainRow: null, fullText: '' };
            }
            groups[groupName].rows.push(row);
            groups[groupName].fullText += row.textContent.toLowerCase() + ' ';

            // Store the "main" row (the one with the course name)
            if (row.querySelector('th[scope="row"]')) {
                groups[groupName].mainRow = row;
            }
        } else {
            rowsWithoutGroup.push(row);
        }
    });

    // --- FILTERING FUNCTION (Working) ---
    const filterInput = document.getElementById('filter-input');
    
    filterInput.addEventListener('keyup', function () {
        const filterText = filterInput.value.toLowerCase();
        
        // Filter groups
        for (const groupName in groups) {
            const group = groups[groupName];
            const isMatch = group.fullText.includes(filterText);
            // Show or hide ALL rows in the group together
            group.rows.forEach(row => {
                row.style.display = isMatch ? '' : 'none';
            });
        }
        // Filter non-grouped rows
        rowsWithoutGroup.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(filterText) ? '' : 'none';
        });
    });

    // --- SORTING FUNCTION (REBUILT) ---
    const table = document.getElementById('schedule');
    const sortableHeaders = table.querySelectorAll('th[data-sortable]');

    sortableHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const columnIndex = Array.from(header.parentNode.children).indexOf(header);
            const sortDirection = header.classList.contains('sort-asc') ? 'desc' : 'asc';
            
            sortableHeaders.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
            header.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');

            sortColumn(columnIndex, sortDirection);
        });
    });

    function sortColumn(columnIndex, direction) {
        const isAsc = direction === 'asc';
        const colName = headerName(columnIndex);

        // Create an array of the groups to be sorted, not the rows
        const groupsArray = Object.values(groups);

        groupsArray.sort((groupA, groupB) => {
            // We ALWAYS sort based on the data in the "main row" of each group
            const mainRowA = groupA.mainRow;
            const mainRowB = groupB.mainRow;
            
            // Failsafe if a group is missing a main row
            if (!mainRowA || !mainRowB) return 0; 

            // Find the correct cell to compare
            const cellA = getCellForSort(mainRowA, columnIndex);
            const cellB = getCellForSort(mainRowB, columnIndex);
            
            let valA = cellA ? cellA.textContent.trim() : '';
            let valB = cellB ? cellB.textContent.trim() : '';
            
            if (colName === 'time') {
                valA = timeToMinutes(valA);
                valB = timeToMinutes(valB);
            } else if (colName === 'day') {
                valA = dayToNumber(valA);
                valB = dayToNumber(valB);
            } else {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }
            
            if (valA < valB) return isAsc ? -1 : 1;
            if (valA > valB) return isAsc ? 1 : -1;
            return 0;
        });

        // This is the fix: Append rows back to the table *in their sorted group order*
        groupsArray.forEach(group => {
            group.rows.forEach(row => {
                scheduleBody.appendChild(row);
            });
        });

        // Re-append any ungrouped rows (if any)
        rowsWithoutGroup.forEach(row => {
            scheduleBody.appendChild(row);
        });
    }
    
    // Helper to get the correct header name from the `data-name` attribute
    function headerName(columnIndex) {
        const headerRow = table.querySelector('thead tr');
        if (headerRow && headerRow.children[columnIndex]) {
            return headerRow.children[columnIndex].dataset.name || '';
        }
        return '';
    }

    // Helper to get the correct cell from the main row
    function getCellForSort(mainRow, colIndex) {
        // This is simple: the indices in the main row match the header indices
        return mainRow.children[colIndex];
    }
    
    // Helper to convert day string to a number for sorting
    function dayToNumber(dayStr) {
        dayStr = dayStr.toLowerCase();
        switch (dayStr) {
            case 'sunday': return 0;
            case 'monday': return 1;
            case 'tuesday': return 2;
            case 'wednesday': return 3;
            case 'thursday': return 4;
            default: return 7; // Put empty/invalid days at the end
        }
    }

    // Helper to convert time string to minutes
    function timeToMinutes(timeStr) {
        // Gets the *first* time in a string like "1:00 PM - 2:40 PM"
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/);
        if (!match) return 9999; // Put invalid times at the end

        let [ , hours, minutes, meridiem] = match;
        hours = parseInt(hours);
        minutes = parseInt(minutes);

        if (meridiem === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (meridiem === 'AM' && hours === 12) {
            hours = 0; // Midnight
        }
        return hours * 60 + minutes;
    }

    // --- Accessibility: Allow keyboard focus on rows ---
    allRows.forEach(row => { 
        row.setAttribute('tabindex', '0');
        row.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                // Placeholder for future action
                // e.g., openDetailsModal(row);
            }
        });
    });
});

