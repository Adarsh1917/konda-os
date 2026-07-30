const { dialog, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function createNode(fullPath, parentPath = undefined) {
    const stat = fs.statSync(fullPath);

    const node = {
        id: crypto.randomUUID(),
        name: path.basename(fullPath),
        type: stat.isDirectory() ? "directory" : "file",
        path: fullPath,
        parentPath,
    };

    if (stat.isDirectory()) {
        node.expanded = true;

        node.children = fs
            .readdirSync(fullPath)
            .sort((a, b) => a.localeCompare(b))
            .map((name) =>
                createNode(
                    path.join(fullPath, name),
                    fullPath
                )
            );
    }

    return node;
}

function registerFileSystemIPC() {

    ipcMain.handle("filesystem:openFolder", async () => {

        const result = await dialog.showOpenDialog({
            properties: ["openDirectory"],
        });

        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }

        const rootPath = result.filePaths[0];

        return {
            rootPath,
            files: [createNode(rootPath)],
        };
    });

    ipcMain.handle("filesystem:readFile", async (_, filePath) => {
        return fs.readFileSync(filePath, "utf8");
    });

    ipcMain.handle(
        "filesystem:saveFile",
        async (_, filePath, content) => {
            fs.writeFileSync(filePath, content, "utf8");
            return true;
        }
    );
}
    ipcMain.handle(
        "filesystem:createFile",
        async (_, filePath) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.writeFileSync(
                        filePath,
                        "",
                        "utf8"
                    );
                }

                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        }
    );

    ipcMain.handle(
        "filesystem:createFolder",
        async (_, folderPath) => {
            try {
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(
                        folderPath,
                        {
                            recursive: true,
                        }
                    );
                }

                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        }
    );

    ipcMain.handle(
        "filesystem:rename",
        async (_, oldPath, newPath) => {
            try {
                fs.renameSync(
                    oldPath,
                    newPath
                );

                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        }
    );

    ipcMain.handle(
        "filesystem:delete",
        async (_, targetPath) => {
            try {
                const stat =
                    fs.statSync(
                        targetPath
                    );

                if (stat.isDirectory()) {
                    fs.rmSync(
                        targetPath,
                        {
                            recursive: true,
                            force: true,
                        }
                    );
                } else {
                    fs.unlinkSync(
                        targetPath
                    );
                }

                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        }
    );

module.exports = {
    registerFileSystemIPC,
};