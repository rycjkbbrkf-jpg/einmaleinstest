let currentTest = null;

let currentTaskIndex = 0;

let answers = [];

let timerInterval = null;

let startTime = null;

let activeInput = "answer";

document.addEventListener("DOMContentLoaded", () => {

    const createButton =
        document.getElementById(
            "createTestBtn"
        );

    if (createButton) {

        createButton.addEventListener(
            "click",
            createTest
        );
    }

    initKeypad();

    loadTestFromUrl();
});

function createTest() {

    const rows = [];

    document
        .querySelectorAll(
            "#rowSelection input:checked"
        )
        .forEach(cb => {

            rows.push(
                parseInt(cb.value)
            );

        });

    if (rows.length === 0) {

        alert(
            "Bitte mindestens eine Reihe auswählen."
        );

        return;
    }

    const settings = {

        rows: rows,

        multiplication:
            document.getElementById(
                "multiplication"
            ).checked,

        division:
            document.getElementById(
                "division"
            ).checked,

        divisionRest:
            document.getElementById(
                "divisionRest"
            ).checked,

        extended1000:
            document.getElementById(
                "extended1000"
            ).checked,

        taskCount:
            parseInt(
                document.getElementById(
                    "taskCount"
                ).value
            ),

        timeMinutes:
            parseInt(
                document.getElementById(
                    "testTime"
                ).value
            )
    };

    const tasks =
        createFinalTaskSet(
            settings
        );

    currentTest = {

        settings,
        tasks
    };

    createTestLink();
}

function createTestLink() {

    const encoded =
        btoa(
            encodeURIComponent(
                JSON.stringify(
                    currentTest
                )
            )
        );

    const url =
        window.location.origin +
        window.location.pathname +
        "?test=" +
        encoded;

    document.getElementById(
        "testOutput"
    ).innerHTML = `

        <h3>Test-Link</h3>

        <textarea
            style="width:100%;height:120px;">
${url}
        </textarea>

    `;

    createQRCode(url);
}

function createQRCode(url) {

    const qrContainer =
        document.getElementById(
            "qrCode"
        );

    qrContainer.innerHTML = "";

    new QRCode(
        qrContainer,
        {
            text: url,
            width: 250,
            height: 250
        }
    );
}
function loadTestFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const testData =
        params.get("test");

    if (!testData) {

        return;
    }

    try {

        currentTest =
            JSON.parse(
                decodeURIComponent(
                    atob(testData)
                )
            );

        document
            .getElementById(
                "teacherPage"
            )
            .classList
            .add("hidden");

        document
            .getElementById(
                "studentPage"
            )
            .classList
            .remove("hidden");

    } catch (e) {

        console.error(e);

        alert(
            "Fehler beim Laden des Tests."
        );
    }
}
const startButton =
    document.getElementById(
        "startBtn"
    );

if (startButton) {

    startButton.addEventListener(
        "click",
        startExam
    );
}

function startExam() {

    const studentName =
        document.getElementById(
            "studentName"
        ).value
        .trim();

    if (!studentName) {

        alert(
            "Bitte Namen eingeben."
        );

        return;
    }

    startTime =
        new Date();

    answers = [];

    currentTaskIndex = 0;

    document
        .getElementById(
            "examArea"
        )
        .classList
        .remove("hidden");

    startTimer();

    showCurrentTask();
}
function startTimer() {

    const totalSeconds =
        currentTest.settings.timeMinutes * 60;

    let remaining =
        totalSeconds;

    updateTimerDisplay(
        remaining
    );

    timerInterval =
        setInterval(() => {

            remaining--;

            updateTimerDisplay(
                remaining
            );

            if (remaining <= 0) {

                clearInterval(
                    timerInterval
                );

                finishExam();
            }

        }, 1000);
}

function updateTimerDisplay(
    seconds
) {

    const minutes =
        Math.floor(
            seconds / 60
        );

    const restSeconds =
        seconds % 60;

    document.getElementById(
        "timer"
    ).innerText =
        `${minutes}:${String(
            restSeconds
        ).padStart(2, "0")}`;
}
function showCurrentTask() {

    const task =
        currentTest.tasks[
            currentTaskIndex
        ];

    if (!task) {

        finishExam();

        return;
    }

    document.getElementById(
        "progress"
    ).innerText =
        `Aufgabe ${currentTaskIndex + 1}
         von ${currentTest.tasks.length}`;

    document.getElementById(
        "taskDisplay"
    ).innerText =
        task.question;

    document.getElementById(
        "answerField"
    ).value = "";

    document.getElementById(
        "restField"
    ).value = "";

    activeInput =
        "answer";

    const restContainer =
        document.getElementById(
            "answerFieldRestContainer"
        );

    if (
        task.type ===
        "divRest"
    ) {

        restContainer
            .classList
            .remove("hidden");

    } else {

        restContainer
            .classList
            .add("hidden");
    }
}
function initKeypad() {

    const keypadButtons =
        document.querySelectorAll(
            "#keypad button"
        );

    keypadButtons.forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                const digit =
                    btn.dataset.number;

                if (
                    activeInput ===
                    "answer"
                ) {

                    document
                        .getElementById(
                            "answerField"
                        )
                        .value += digit;

                } else {

                    document
                        .getElementById(
                            "restField"
                        )
                        .value += digit;
                }

            }
        );

    });

    const answerBox =
        document.getElementById(
            "answerField"
        );

    const restBox =
        document.getElementById(
            "restField"
        );

    answerBox.addEventListener(
        "click",
        () => {

            activeInput =
                "answer";
        }
    );

    restBox.addEventListener(
        "click",
        () => {

            activeInput =
                "rest";
        }
    );

    document
        .getElementById(
            "deleteBtn"
        )
        .addEventListener(
            "click",
            deleteDigit
        );

    document
        .getElementById(
            "confirmBtn"
        )
        .addEventListener(
            "click",
            saveAnswer
        );
}
function deleteDigit() {

    const field =
        activeInput === "answer"
        ? document.getElementById(
            "answerField"
        )
        : document.getElementById(
            "restField"
        );

    field.value =
        field.value.slice(
            0,
            -1
        );
}
function saveAnswer() {

    const task =
        currentTest.tasks[
            currentTaskIndex
        ];

    const answer =
        document
            .getElementById(
                "answerField"
            )
            .value;

    const rest =
        document
            .getElementById(
                "restField"
            )
            .value;

    answers.push({

        givenAnswer:
            answer,

        givenRest:
            rest

    });

    currentTaskIndex++;

    showCurrentTask();
}
function finishExam() {

    clearInterval(
        timerInterval
    );

    document
        .getElementById(
            "studentPage"
        )
        .classList
        .add("hidden");

    document
        .getElementById(
            "resultPage"
        )
        .classList
        .remove("hidden");

    buildResultPage();
}
function buildResultPage() {

    const resultDiv =
        document.getElementById(
            "resultContent"
        );

    let correct = 0;

    let html = "";

    currentTest.tasks.forEach(
        (
            task,
            index
        ) => {

            const student =
                answers[index] || {};

            let ok = false;

            if (
                task.type ===
                "divRest"
            ) {

                ok =
                    Number(
                        student.givenAnswer
                    ) ===
                    task.answer
                    &&
                    Number(
                        student.givenRest
                    ) ===
                    task.rest;

            } else {

                ok =
                    Number(
                        student.givenAnswer
                    ) ===
                    task.answer;
            }

            if (ok) {

                correct++;
            }

            html +=

            `<div class="result-row">

                ${index + 1}.
                ${task.question}

                →

                ${student.givenAnswer || "-"}

                ${
                    task.type === "divRest"
                    ?
                    ` Rest ${
                        student.givenRest || "-"
                    }`
                    :
                    ""
                }

                ${
                    ok
                    ?
                    "<span class='correct'>✓</span>"
                    :
                    `<span class='wrong'>
                        ✗
                        richtig:
                        ${task.answer}
                        ${
                            task.type === "divRest"
                            ?
                            ", Rest " +
                              task.rest
                            :
                            ""
                        }
                    </span>`
                }

            </div>`;
        }
    );

    const workTime =
        Math.floor(
            (
                new Date() -
                startTime
            ) / 1000
        );

    html += `

        <div class="summary">

            Name:
            ${
                document.getElementById(
                    "studentName"
                ).value
            }

            <br><br>

            Richtige Aufgaben:
            ${correct}
            von
            ${currentTest.tasks.length}

            <br><br>

            Arbeitszeit:
            ${workTime}
            Sekunden

        </div>

    `;

    resultDiv.innerHTML =
        html;
}
