// Global Variables
let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let formativeWeight = 20; // Formative 20%
let summativeWeight = 80; // Summative 80%

// Save Data
function saveData() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

// Load Data on Page Load
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("index.html")) {
        renderSubjects();
        calculateGPA();
    } else if (window.location.pathname.includes("subject.html")) {
        renderSubjectDetails();
    }
});

// Navigate Back to Home
function goHome() {
    saveData();
    window.location.href = "index.html";
}

// Add a New Subject
function addSubject() {
    const newSubject = { name: "New Subject", assessments: [] };
    subjects.push(newSubject);
    saveData();
    renderSubjects();
    calculateGPA();
}

// Render All Subjects
function renderSubjects() {
    const subjectsDiv = document.getElementById("subjects");
    subjectsDiv.innerHTML = '';

    subjects.forEach((subject, index) => {
        const finalGrade = calculateFinalGrade(subject);

        subjectsDiv.innerHTML += `
            <div class="subject">
                <div id="subject-name-${index}">
                    ${subject.name}
                    <button class="small-btn" onclick="editSubjectName(${index})">Edit</button>
                </div>
                <div>Final Grade: ${finalGrade}</div>
                <button class="btn save-btn" onclick="openSubject(${index})">Details</button>
                <button class="btn small-btn" onclick="deleteSubject(${index})">Delete</button>
            </div>
        `;
    });
}


// Edit Subject Name
function editSubjectName(index) {
    const subjectDiv = document.getElementById(`subject-name-${index}`);
    subjectDiv.innerHTML = `
        <input type="text" id="edit-name-${index}" value="${subjects[index].name}" />
        <button class="btn small-btn" onclick="saveSubjectName(${index})">Save</button>
    `;
}

// Save Edited Subject Name
function saveSubjectName(index) {
    const newName = document.getElementById(`edit-name-${index}`).value.trim();
    if (newName) {
        subjects[index].name = newName;
        saveData();
        renderSubjects();
    } else {
        alert("Name cannot be empty!");
    }
}

// Delete Subject
function deleteSubject(index) {
    subjects.splice(index, 1);
    saveData();
    renderSubjects();
    calculateGPA();
}

// Open Subject Details
function openSubject(index) {
    localStorage.setItem("currentSubject", index);
    window.location.href = "subject.html";
}

// Render Subject Details
function renderSubjectDetails() {
    const currentSubjectIndex = localStorage.getItem("currentSubject");
    const subject = subjects[currentSubjectIndex];
    if (!subject) return goHome();

    document.getElementById("subjectName").innerText = subject.name;
    renderAssessments();
    calculateFinalGrade(subject);
}

// Add Assessment
function addAssessment() {
    const currentSubjectIndex = localStorage.getItem("currentSubject");
    const subject = subjects[currentSubjectIndex];

    const newAssessment = { type: "Formative", grade: "A", score: 10 }; // 기본값 설정
    subject.assessments.push(newAssessment);

    saveData();
    renderAssessments(); // 업데이트된 리스트 렌더링
}

// Convert Letter Grade to Numeric Score
function convertGradeToNumeric(grade) {
    const gradeMapping = {
        "A": 10,
        "A-": 9,
        "B+": 8,
        "B": 7,
        "B-": 6,
        "C+": 5,
        "C": 4,
        "C-": 3,
        "D+": 2,
        "D": 1,
        "F": 0,
    };
    return gradeMapping[grade] || 0;
}

// Convert Average Numeric Score to Final Grade
function convertNumericToGrade(average) {
    if (average >= 9.45) return "A";
    if (average >= 9.00) return "A-";
    if (average >= 8.00) return "B+";
    if (average >= 7.00) return "B";
    if (average >= 6.00) return "B-";
    if (average >= 5.00) return "C+";
    if (average >= 4.00) return "C";
    if (average >= 3.00) return "C-";
    if (average >= 2.00) return "D+";
    if (average >= 1.00) return "D";
    return "F";
}

// Render Assessments with Calculation Details
function renderAssessments() {
    const currentSubjectIndex = localStorage.getItem("currentSubject");
    const subject = subjects[currentSubjectIndex];
    const assessmentsDiv = document.getElementById("assessments");

    // 테이블 초기화
    assessmentsDiv.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Type</th>
                    <th>Grade</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="assessmentTableBody"></tbody>
        </table>
    `;

    const tableBody = document.getElementById("assessmentTableBody");

    if (subject.assessments.length === 0) {
        // 평가 항목이 없는 경우
        tableBody.innerHTML = `
            <tr>
                <td colspan="4">No assessments added yet. Click "Add Assessment" to get started.</td>
            </tr>
        `;
    } else {
        // 평가 항목이 있는 경우
        subject.assessments.forEach((assessment, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <select onchange="updateAssessmentType(${index}, this.value)">
                            <option value="Formative" ${assessment.type === "Formative" ? "selected" : ""}>Formative</option>
                            <option value="Summative" ${assessment.type === "Summative" ? "selected" : ""}>Summative</option>
                        </select>
                    </td>
                    <td>
                        <select onchange="updateAssessmentGrade(${index}, this.value)">
                            <option value="A" ${assessment.grade === "A" ? "selected" : ""}>A</option>
                            <option value="A-" ${assessment.grade === "A-" ? "selected" : ""}>A-</option>
                            <option value="B+" ${assessment.grade === "B+" ? "selected" : ""}>B+</option>
                            <option value="B" ${assessment.grade === "B" ? "selected" : ""}>B</option>
                            <option value="B-" ${assessment.grade === "B-" ? "selected" : ""}>B-</option>
                            <option value="C+" ${assessment.grade === "C+" ? "selected" : ""}>C+</option>
                            <option value="C" ${assessment.grade === "C" ? "selected" : ""}>C</option>
                            <option value="C-" ${assessment.grade === "C-" ? "selected" : ""}>C-</option>
                            <option value="D+" ${assessment.grade === "D+" ? "selected" : ""}>D+</option>
                            <option value="D" ${assessment.grade === "D" ? "selected" : ""}>D</option>
                            <option value="F" ${assessment.grade === "F" ? "selected" : ""}>F</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn small-btn" onclick="deleteAssessment(${index})">Delete</button>
                    </td>
                </tr>
            `;
        });
    }

    // Add Assessment 버튼 추가
    const addButton = document.createElement("button");
    addButton.id = "add-assignment-button";
    addButton.className = "btn add-btn";
    addButton.innerText = "+ Add Assessment";
    addButton.onclick = addAssessment;
    assessmentsDiv.appendChild(addButton);

    // Final Grade 계산
    const average = calculateAverage(subject);
    const finalGrade = convertNumericToGrade(average);
    document.getElementById("finalGrade").innerText = `Final Grade: ${finalGrade}`;
}

// Save Assessment Changes
function saveAssessment(index) {
    saveData();
    alert("Assessment saved successfully!");
}

// Calculate Final Grade
function calculateFinalGrade(subject) {
    if (!subject || !subject.assessments || subject.assessments.length === 0) {
        return "N/A";
    }

    let totalCal = 0;
    let totalSum = 0;

    subject.assessments.forEach(assessment => {
        const numericScore = convertGradeToNumeric(assessment.grade);
        const weight = assessment.type === "Formative" ? formativeWeight / 100 : summativeWeight / 100;
        const cal = numericScore * weight;
        totalCal += cal;
        totalSum += weight;
    });

    if (totalSum === 0) {
        return "N/A";
    }

    const average = totalCal / totalSum;
    return convertNumericToGrade(average);
}


// Update Weights for Formative and Summative
function updateWeights() {
    const formativeInput = document.getElementById("formativeWeight");
    const summativeInput = document.getElementById("summativeWeight");

    const newFormativeWeight = parseInt(formativeInput.value, 10);
    const newSummativeWeight = parseInt(summativeInput.value, 10);

    if (newFormativeWeight + newSummativeWeight !== 100) {
        alert("Formative and Summative weights must add up to 100%");
        return;
    }

    formativeWeight = newFormativeWeight;
    summativeWeight = newSummativeWeight;

    alert("Weights updated successfully!");
}

// Delete an Assessment
function deleteAssessment(index) {
    const currentSubjectIndex = localStorage.getItem("currentSubject");
    const subject = subjects[currentSubjectIndex];

    if (!subject || !subject.assessments) return;

    subject.assessments.splice(index, 1); // 선택된 Assessment 삭제
    saveData();
    renderAssessments(); // 업데이트된 리스트 렌더링
}

function calculateGPA() {
    let totalGPA = 0; // 총 GPA 합계
    let subjectCount = 0; // 과목 수

    // 각 과목의 Final Grade를 GPA로 변환하여 합산
    subjects.forEach(subject => {
        const finalGrade = calculateFinalGrade(subject); // 과목의 최종 Grade 계산
        if (finalGrade !== "N/A") {
            const gpa = convertGradeToGPA(finalGrade); // Final Grade를 GPA로 변환
            totalGPA += gpa;
            subjectCount++;
        }
    });

    // 평균 GPA 계산
    const averageGPA = (totalGPA / subjectCount || 0).toFixed(2); // 과목이 없을 경우 0으로 표시

    // GPA 표시 업데이트
    const gpaDisplay = document.getElementById("gpa");
    if (gpaDisplay) {
        gpaDisplay.innerText = `GPA: ${averageGPA}`; // 평균 GPA 표시
    }
}

// Convert Final Grade to 4.0 GPA Scale
function convertGradeToGPA(grade) {
    const gradeMapping = {
        "A": 4.0,
        "A-": 3.7,
        "B+": 3.3,
        "B": 3.0,
        "B-": 2.7,
        "C+": 2.3,
        "C": 2.0,
        "C-": 1.7,
        "D+": 1.3,
        "D": 1.0,
        "F": 0.0,
    };
    return gradeMapping[grade] || 0.0;
}

function updateAssessmentType(index, type) {
    const currentSubjectIndex = localStorage.getItem("currentSubject");
    const subject = subjects[currentSubjectIndex];

    if (subject && subject.assessments[index]) {
        subject.assessments[index].type = type;
        saveData();
        renderAssessments(); // 변경 사항 반영
    }
}

function updateAssessmentGrade(index, grade) {
    const currentSubjectIndex = localStorage.getItem("currentSubject");
    const subject = subjects[currentSubjectIndex];

    if (subject && subject.assessments[index]) {
        subject.assessments[index].grade = grade;
        saveData();
        renderAssessments(); // 변경 사항 반영
    }
}

