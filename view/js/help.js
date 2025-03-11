const helpData = [
    {
        id: 1,
        title: "Getting Started",
        content: [
            {
                question: "How do I create an account?",
                answer:
                    "Click the 'Sign Up' button in the top right corner. Fill in your details and verify your email address to get started.",
            },
            {
                question: "What are the system requirements?",
                answer:
                    "Our platform works best on modern browsers like Chrome, Firefox, Safari, or Edge. Make sure your browser is up to date for the best experience.",
            },
        ],
    },
    {
        id: 2,
        title: "Account & Settings",
        content: [
            {
                question: "How do I reset my password?",
                answer:
                    "Click 'Forgot Password' on the login page. Enter your email address and follow the instructions sent to your inbox.",
            },
            {
                question: "How can I update my profile?",
                answer:
                    "Go to Settings → Profile. Here you can update your personal information, profile picture, and notification preferences.",
            },
        ],
    },
    {
        id: 3,
        title: "Billing & Subscription",
        content: [
            {
                question: "What payment methods do you accept?",
                answer:
                    "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.",
            },
            {
                question: "How do I cancel my subscription?",
                answer:
                    "Go to Settings → Billing → Manage Subscription. Click 'Cancel Subscription' and follow the prompts.",
            },
        ],
    },
];

function renderHelpSections(sections) {
    const container = document.getElementById("helpSections");
    container.innerHTML = "";

    sections.forEach((section) => {
        if (section.content.length === 0) return;

        const sectionElement = document.createElement("div");
        sectionElement.className = "help-section";
        sectionElement.innerHTML = `
                <div class="section-header" onclick="toggleSection(${section.id
            })">
                    <h2>${section.title}</h2>
                    <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="section-${section.id}">
                    ${section.content
                .map(
                    (item) => `
                        <div class="qa-item">
                            <h3>${item.question}</h3>
                            <p>${item.answer}</p>
                        </div>
                    `
                )
                .join("")}
                </div>
            `;
        container.appendChild(sectionElement);
    });
}

function toggleSection(sectionId) {
    const content = document.getElementById(`section-${sectionId}`);
    const header = content.previousElementSibling;
    const wasActive = content.classList.contains("active");

    // Close all sections
    document.querySelectorAll(".section-content").forEach((section) => {
        section.classList.remove("active");
        section.previousElementSibling.classList.remove("active");
    });

    // Toggle clicked section
    if (!wasActive) {
        content.classList.add("active");
        header.classList.add("active");
    }
}

function filterContent(searchTerm) {
    const filteredSections = helpData.map((section) => ({
        ...section,
        content: section.content.filter(
            (item) =>
                item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    }));
    renderHelpSections(filteredSections);
}

renderHelpSections(helpData);

document.getElementById("searchInput").addEventListener("input", (e) => {
    filterContent(e.target.value);
});