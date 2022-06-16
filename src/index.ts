import { exec } from "child_process";

function main() {
    const SHUTDOWN_AT = process.env.SHUTDOWN_AT;
    if (SHUTDOWN_AT == null) throw new Error("Missing env var: SHUTDOWN_AT in format hh:mm, 24h");
    // Get current datetime
    const now = new Date();
    const [h, m] = SHUTDOWN_AT.split(":").map(Number);

    const shutdownAt = new Date(now);
    shutdownAt.setHours(h);
    shutdownAt.setMinutes(m);
    shutdownAt.setSeconds(0);
    shutdownAt.setMilliseconds(0);

    const diffSeconds = Math.round((shutdownAt.getTime() - now.getTime()) / 1000);

    if (diffSeconds < 0) {
        console.log(`[AUTO_SHUTDOWN] Shutdown hour already passed.`);
        return;
    }
    const command = `shutdown /s /t ${diffSeconds}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`[AUTO_SHUTDOWN] error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`[AUTO_SHUTDOWN] stderr: ${stderr}`);
            return;
        }
        console.log(stdout);
    });

    console.log(`[AUTO_SHUTDOWN] Shutdown scheduled at ${shutdownAt}`);
    // console.log({
    //     now,
    //     shutdownAt,
    //     diffSeconds,
    //     command,
    // });
}
main();
