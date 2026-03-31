// Notes Data
const notesData = {
    python: [
        {
            title: "Python",
            topic: "Introduction, Data Types, Control Flow",
            type: "pdf",
            url: "./Python.pdf"
        },
        {
            title: "Python OOP",
            topic: "Classes, Objects, Inheritance, Polymorphism",
            type: "pdf",
            url: "./Python.pdf"
        }
    ],
    cpp: [
        {
            title: "C++",
            topic: "Syntax, Data Types, Control Structures",
            type: "pdf",
            url: "./PYQ'S C++ oops.pdf"
        },
        {
            title: "C++ OOP",
            topic: "Classes, Inheritance, Polymorphism, Templates",
            type: "pdf",
            url: "./PYQ'S C++ oops.pdf"
        }
    ],
      
    java: [
        {
            title: "Java Core",
            topic: "Basics, OOP, Exception Handling",
            type: "pdf",
            url: "./Java.pdf"
        },
        {
            title: "Java Collections",
            topic: "List, Set, Map, Stream API",
            type: "pdf",
            url: "./Java.pdf"
        }
    ],
    dbms: [
        {
            title: "DBMS Fundamentals",
            topic: "Complete DBMS Course",
            type: "pdf",
            url: "./DBMS.pdf"
        }
    ],
    os: [
        {
            title: "OS Basics",
            topic: "Complete OS Course",
            type: "pdf",
            url: "./Operating Systems.pdf"
        }
    ],
    cn: [
        {
            title: "Networking Basics",
            topic: "Complete Networking Course",
            type: "pdf",
            url: "./Computer Networks.pdf"
        }
    ]
};

// Initialize event listeners for view buttons
document.addEventListener('DOMContentLoaded', () => {
    const viewButtons = document.querySelectorAll('.download-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const subject = button.getAttribute('data-subject');
            const index = parseInt(button.getAttribute('data-index'));
            viewNote(subject, index);
        });
    });
});

// View Note Function
function viewNote(subject, index) {
    try {
        const note = notesData[subject]?.[index];
        if (!note) {
            throw new Error(`Note not found for subject: ${subject}, index: ${index}`);
        }

        // Clear previous note content
        document.querySelector('.note-content')?.remove();

        // Add class to subjects container for split view
        document.getElementById('subjectsContainer').classList.add('with-pdf');

        // Create the note content container
        const noteContent = document.createElement("div");
        noteContent.className = "note-content";

        // Verify PDF file exists and display content
        if (note.type === "pdf") {
            fetch(note.url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('PDF file not found');
                    }
                    return response;
                })
                .then(() => {
                    noteContent.innerHTML = `
                        <div class="note-header">
                            <h2>${note.title}</h2>
                            <p class="note-topic">${note.topic}</p>
                        </div>
                        <div class="note-body">
                            <iframe src="${note.url}" width="100%" height="600px" frameborder="0"></iframe>
                        </div>
                        <div class="note-actions">
                            <a href="${note.url}" target="_blank"><button>Open in New Tab</button></a>
                            <button class="close-btn">Close</button>
                        </div>
                    `;
                    document.body.appendChild(noteContent);
                    noteContent.style.position = 'fixed';
                    noteContent.style.right = '0';
                    noteContent.style.top = '0';
                    noteContent.style.width = '50%';
                    noteContent.style.height = '100vh';
                    noteContent.style.overflowY = 'auto';
                    noteContent.style.background = 'white';
                    noteContent.style.padding = '20px';
                    noteContent.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.1)';

                    // Setup close functionality
                    const closeNote = () => {
                        noteContent.remove();
                        document.getElementById('subjectsContainer').classList.remove('with-pdf');
                        document.removeEventListener('click', clickOutside);
                    };

                    const clickOutside = (e) => {
                        if (!noteContent.contains(e.target)) {
                            closeNote();
                        }
                    };

                    noteContent.querySelector('.close-btn').onclick = closeNote;
                    
                    // Prevent click on note content from closing
                    noteContent.addEventListener('click', e => e.stopPropagation());

                    // Setup outside click handler
                    setTimeout(() => {
                        document.addEventListener('click', clickOutside);
                    }, 100);
                })
                .catch(error => {
                    console.error('Error loading PDF:', error);
                    alert('The PDF file is currently unavailable. Please try again later.');
                    noteContent.remove();
                });
        } else if (note.type === "text") {
            // Handling text notes
            noteContent.innerHTML = `
                <div class="note-header">
                    <h2>${note.title}</h2>
                    <p class="note-topic">${note.topic}</p>
                </div>
                <div class="note-body">
                    <p>${note.content}</p>
                </div>
                <div class="note-actions">
                    <button class="close-btn">Close</button>
                </div>
            `;
            document.body.appendChild(noteContent);

            // Setup close functionality
            const closeNote = () => {
                noteContent.remove();
                document.removeEventListener('click', clickOutside);
            };

            const clickOutside = (e) => {
                if (!noteContent.contains(e.target)) {
                    closeNote();
                }
            };

            noteContent.querySelector('.close-btn').onclick = closeNote;
            
            // Prevent click on note content from closing
            noteContent.addEventListener('click', e => e.stopPropagation());

            // Setup outside click handler
            setTimeout(() => {
                document.addEventListener('click', clickOutside);
            }, 100);
        }
    } catch (error) {
        console.error('Error displaying note:', error);
        alert('An error occurred while displaying the note.');
    }
}
