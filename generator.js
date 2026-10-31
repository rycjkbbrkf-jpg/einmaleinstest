function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
        [array[j], array[i]];
    }

    return array;
}

function createMultiplicationTasks(rows) {

    let tasks = [];

    rows.forEach(row => {

        for (let i = 1; i <= 12; i++) {

            tasks.push({

                type: "mul",

                question: `${i} × ${row}`,

                answer: i * row

            });

        }

    });

    return tasks;
}

function createDivisionTasks(rows) {

    let tasks = [];

    rows.forEach(row => {

        for (let i = 1; i <= 12; i++) {

            tasks.push({

                type: "div",

                question: `${i * row} : ${row}`,

                answer: i

            });

        }

    });

    return tasks;
}

function createDivisionRestTasks(rows) {

    let tasks = [];

    rows.forEach(row => {

        for (let i = 1; i <= 12; i++) {

            const result = i;

            const rest =
                Math.floor(Math.random() * row);

            if (rest === 0) continue;

            tasks.push({

                type: "divRest",

                question:
                    `${(i * row) + rest} : ${row}`,

                answer: result,

                rest: rest

            });

        }

    });

    return tasks;
}

function createExtendedTasks(rows) {

    let tasks = [];

    rows.forEach(row => {

        const tens = [
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            100
        ];

        tens.forEach(t => {

            const result = row * t;

            if (result <= 1000) {

                tasks.push({

                    type: "extendedMul",

                    question:
                        `${row} × ${t}`,

                    answer: result

                });

                tasks.push({

                    type: "extendedDiv",

                    question:
                        `${result} : ${row}`,

                    answer: t

                });

            }

        });

    });

    return tasks;
}

function removeDuplicates(tasks) {

    const seen = new Set();

    return tasks.filter(task => {

        if (seen.has(task.question)) {

            return false;

        }

        seen.add(task.question);

        return true;

    });

}

function buildTaskPool(settings) {

    let pool = [];

    if (settings.multiplication) {

        pool.push(

            ...createMultiplicationTasks(
                settings.rows
            )

        );

    }

    if (settings.division) {

        pool.push(

            ...createDivisionTasks(
                settings.rows
            )

        );

    }

    if (settings.divisionRest) {

        pool.push(

            ...createDivisionRestTasks(
                settings.rows
            )

        );

    }

    if (settings.extended1000) {

        pool.push(

            ...createExtendedTasks(
                settings.rows
            )

        );

    }

    pool =
        removeDuplicates(pool);

    shuffle(pool);

    return pool;
}

function createFinalTaskSet(settings) {

    let pool =
        buildTaskPool(settings);

    let result = [];

    while (
        result.length <
        settings.taskCount
    ) {

        if (pool.length > 0) {

            result.push(pool.shift());

        } else {

            const backup =
                buildTaskPool(settings);

            shuffle(backup);

            result.push(

                backup[0]

            );

        }

    }

    return result;
}
