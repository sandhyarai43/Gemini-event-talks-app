document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('search-input');
    let talks = [];

    // Fetch talk data
    fetch('data/talks.json')
        .then(response => response.json())
        .then(data => {
            talks = data;
            renderSchedule(talks);
        })
        .catch(error => {
            console.error('Error fetching talks data:', error);
            scheduleContainer.innerHTML = '<p>Error loading schedule. Please try again later.</p>';
        });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTalks = talks.filter(talk => 
            talk.categories.some(category => category.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    // Function to render the schedule
    function renderSchedule(talksToRender) {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

        talksToRender.forEach((talk, index) => {
            const startTime = new Date(currentTime);
            const endTime = new Date(startTime.getTime() + talk.duration * 60000);

            const scheduleItem = createTalkElement(talk, startTime, endTime);
            scheduleContainer.appendChild(scheduleItem);

            currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

            if (index === 2) { // Lunch break after the 3rd talk
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
                const lunchBreakElement = createBreakElement('Lunch Break', lunchStartTime, lunchEndTime);
                scheduleContainer.appendChild(lunchBreakElement);
                currentTime = lunchEndTime;
                currentTime = new Date(currentTime.getTime() + 10 * 60000); // 10 minute break after lunch
            }
        });
    }

    // Function to create a talk element
    function createTalkElement(talk, startTime, endTime) {
        const item = document.createElement('div');
        item.classList.add('schedule-item');

        item.innerHTML = `
            <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
            <h2>${talk.title}</h2>
            <div class="speakers">By: ${talk.speakers.join(', ')}</div>
            <div class="categories">
                ${talk.categories.map(cat => `<span class="category">${cat}</span>`).join('')}
            </div>
            <p class="description">${talk.description}</p>
        `;
        return item;
    }

    // Function to create a break element
    function createBreakElement(title, startTime, endTime) {
        const item = document.createElement('div');
        item.classList.add('schedule-item', 'break');
        item.innerHTML = `
            <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
            <div>${title}</div>
        `;
        return item;
    }

    // Function to format time as HH:MM AM/PM
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});
