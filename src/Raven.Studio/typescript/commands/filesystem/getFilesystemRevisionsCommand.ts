import commandBase = require("commands/commandBase");
import file = require("models/filesystem/file");
import filesystem = require("models/filesystem/filesystem");

class getFilesystemRevisionsCommand extends commandBase {

    constructor(private fs: filesystem, private skip: number, private take: number) {
        super();
    }

    execute(): JQueryPromise<pagedResult<file>> {
        var filesTask = this.fetchFiles();
        var doneTask = $.Deferred<pagedResult<file>>();

        filesTask.done((results: filesystemFileHeaderDto[]) => {
            var wrappedResult = {
                Files: results,
                FileCount: (results.length === this.take) ? this.take + this.skip + 10 : this.skip + results.length,
                Start: this.skip,
                PageSize: this.take
            }

            var files = wrappedResult.Files.map(d => new file(d, false));
            var totalCount = wrappedResult.FileCount;
            doneTask.resolve({ items: files, totalResultCount: totalCount });
        });
        filesTask.fail(xhr => doneTask.reject(xhr));

        return doneTask;
    }

    private fetchFiles(): JQueryPromise<filesystemFileHeaderDto[]> {
        var args = {
            startsWith: '/',
            matches: '*/revisions/*',
            start: this.skip,
            pageSize: this.take
        };

        var url = "/files";
        var task = this.query(url, args, this.fs, null);

        return task;
    }
}

export = getFilesystemRevisionsCommand;
