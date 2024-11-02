import { IFileStructure } from "../../../../interfaces/IFileStructure";

interface FileSystemNode {
    type: 'file' | 'directory';
    content?: string;
    children?: { [key: string]: FileSystemNode };
}

export class FileSystemService {
    private fileSystem: { [key: string]: FileSystemNode };
    private currentPath: string[];

    constructor(initialStructure: IFileStructure) {
        this.fileSystem = this.convertToInternalStructure(initialStructure);
        this.currentPath = [];
    }

    private convertToInternalStructure(structure: IFileStructure): { [key: string]: FileSystemNode } {
        const result: { [key: string]: FileSystemNode } = {};

        for (const [name, item] of Object.entries(structure)) {
            if (item.type === 'directory') {
                result[name] = {
                    type: 'directory',
                    children: item.children ? this.convertToInternalStructure(item.children) : {}
                };
            } else {
                result[name] = {
                    type: 'file',
                    content: item.content || ''
                };
            }
        }

        return result;
    }

    private getNodeAtPath(path: string[]): FileSystemNode | null {
        let current: { [key: string]: FileSystemNode } = this.fileSystem;

        for (const segment of path) {
            if (!current[segment]) return null;
            if (current[segment].type === 'file') return current[segment];
            current = current[segment].children!;
        }

        return { type: 'directory', children: current };
    }

    public executeCommand(command: string): string {
        const parts = command.trim().split(' ');
        const cmd = parts[0];
        const args = parts[1];

        if (cmd && args) {
            switch (cmd) {
                case 'cd':
                    return this.changeDirectory(args);
                case 'cat':
                    return this.catFile(args);
                case 'touch':
                    return this.createFile(args);
                case 'mkdir':
                    return this.makeDirectory(args);
                case 'rm':
                    return this.removeFile(args);
            }
        }

        switch (cmd) {
            case 'ls':
                return this.listDirectory();
            case 'pwd':
                return this.printWorkingDirectory();
            case 'help':
                return this.showHelp();
        }
        return `Command not found: ${cmd}\nType 'help' for available commands.`;
    }

    private listDirectory(): string {
        const node = this.getNodeAtPath(this.currentPath);
        if (!node || node.type !== 'directory') return 'Not a directory';

        const items = Object.entries(node.children!)
            .map(([name, item]) => `${item.type === 'directory' ? 'd' : '-'} ${name}`)
            .join('\n');

        return items || '(empty directory)';
    }

    private changeDirectory(path: string): string {
        if (!path || path === '.') return '';
        if (path === '..') {
            if (this.currentPath.length > 0) {
                this.currentPath.pop();
            }
            return '';
        }

        const targetPath = [...this.currentPath, path];
        const node = this.getNodeAtPath(targetPath);

        if (!node) return `Directory not found: ${path}`;
        if (node.type !== 'directory') return `Not a directory: ${path}`;

        this.currentPath.push(path);
        return '';
    }

    private printWorkingDirectory(): string {
        return '/' + this.currentPath.join('/');
    }

    private catFile(path: string): string {
        const node = this.getNodeAtPath([...this.currentPath, path]);
        if (!node) return `File not found: ${path}`;
        if (node.type !== 'file') return `Not a file: ${path}`;
        return node.content || '';
    }

    private createFile(path: string): string {
        const parentNode = this.getNodeAtPath(this.currentPath);
        if (!parentNode || parentNode.type !== 'directory') return 'Invalid current directory';

        parentNode.children![path] = { type: 'file', content: '' };
        return '';
    }

    private makeDirectory(path: string): string {
        const parentNode = this.getNodeAtPath(this.currentPath);
        if (!parentNode || parentNode.type !== 'directory') return 'Invalid current directory';

        parentNode.children![path] = { type: 'directory', children: {} };
        return '';
    }

    private removeFile(path: string): string {
        const parentNode = this.getNodeAtPath(this.currentPath);
        if (!parentNode || parentNode.type !== 'directory') return 'Invalid current directory';

        if (!parentNode.children![path]) return `File not found: ${path}`;
        delete parentNode.children![path];
        return '';
    }

    private showHelp(): string {
        return [
            'Available commands:',
            'ls          - List directory contents',
            'cd <dir>    - Change directory',
            'pwd         - Print working directory',
            'cat <file>  - Display file contents',
            'touch <file> - Create new file',
            'mkdir <dir>  - Create new directory',
            'rm <file>    - Remove file',
            'help        - Show this help message'
        ].join('\n');
    }
}