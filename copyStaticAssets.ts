import * as shell from 'shelljs';

// Alpine linux needs more definitive [cp] requests.
shell.mkdir('-p', 'dist/documents')
shell.cp('-R', './documents/*', 'dist/documents/');