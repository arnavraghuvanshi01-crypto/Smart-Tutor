document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filter-form');
    const papersGrid = document.getElementById('papers-grid');

    // Sample data for static PDF files
    const allPapers = [
        { id: 1, year: '2024', subject: 'physics', title: 'physics 2024', type: 'Mid term Examination', file: "PYQ'S Engineering Physics.pdf" },


        { id: 2, year: '2024', subject: 'english', title: 'english 2024', type: 'Mid-term Examination', file: " PYQ'S Advance Technical Communication.pdf " },


        { id: 3, year: '2024', subject: 'AIML', title: 'aiml 2024', type: 'Final Examination', file: "PYQ'S AIML.pdf" },
        { id: 4, year: '2024', subject: 'c++', title: 'c++ oops 2024', type: 'Mid-term Examination', file: "PYQ'S C++ oops.pdf" },
        { id: 5, year: '2024', subject: 'calculas', title: ' calculas Mathematics 2024', type: 'Final Examination', file: "PYQ'S Calculas and Laplace transform.pdf" },
        { id: 6, year: '2024', subject: 'computer network', title: 'computer network 2024', type: 'Mid-term Examination', file: "PYQ'S Computer Networks.pdf" },
        { id: 7, year: '2024', subject: 'discrete mathematics', title: 'discrete mathematics 2024', type: 'Final Examination', file: "PYQ'S Discrete Mathematics.pdf" },
        { id: 8, year: '2024', subject: 'eee', title: 'Eee 2024', type: 'Final Examination', file: "PYQ'S EEE.pdf" },

        { id: 9, year: '2024', subject: 'probability statistics and reliability', title: 'probability statistics 2024', type: 'Mid-term Examination', file: "PYQ'S Probability Statistics and Reliability.pdf" },
    ];

    function renderPapers(papers) {
        papersGrid.innerHTML = papers.map(paper => `
            <div class="paper-card">
                <h3>${paper.title}</h3>
                <p>${paper.type}</p>
                <a href="${paper.file}" class="download-btn" download>
                    <i class="fas fa-download"></i> Download PDF
                </a>
            </div>
        `).join('');
    }

    function filterPapers(year, subject) {
        return allPapers.filter(paper => 
            (!year || paper.year === year) && 
            (!subject || paper.subject === subject)
        );
    }

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const year = document.getElementById('year').value;
        const subject = document.getElementById('subject').value;
        const filteredPapers = filterPapers(year, subject);
        renderPapers(filteredPapers);
    });

    // Initial render
    renderPapers(allPapers);
});
