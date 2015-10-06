#!/usr/bin/env python
import os, time

class FileWatcher(object):
    "A set of files; emits events when any of them changes."
    # cat_nap = shortest nap duraction in seconds
    def __init__(self, filenames=(), cat_nap=0.2):
        self.cat_nap = cat_nap
        self.mtimes = {}  # {filename: mtime|None|'watch'}
        for filename in filenames: self.watch(filename)
    def watch(self, filename):
        if filename not in self.mtimes:
            self.mtimes[filename] = 'watch'
    def __iter__(self):
        last_event_time = time.time()
        while True:
            changed = False
            for filename, mtime in self.mtimes.items():
                try:
                    mtime_now = os.stat(filename).st_mtime
                except OSError:
                    mtime_now = None
                if mtime_now != mtime:
                    changed = True
                    self.mtimes[filename] = mtime_now
                    if mtime == 'watch':
                        if mtime_now is not None:
                            yield filename, 'watched'
                    else:
                        event = ('created' if mtime is None
                                 else 'deleted' if mtime_now is None
                                 else 'modified')
                        yield filename, event
            now = time.time()
            if changed:
                last_event_time = now
            time.sleep(self.nap_time(now - last_event_time))
    def nap_time(self, seconds_quiescent):
        # Lengthen the nap if no file has changed in a good while
        if 15*60 < seconds_quiescent:
            return max(2.5, self.cat_nap)
        elif 5*60 < seconds_quiescent:
            return max(1, self.cat_nap)
        else:
            return self.cat_nap

def ruby_autorun(filenames, runner=None, message=None):
    """Run Ruby whenever any of the files gets modified. By default,
    this runs the file that was modified, but you can set runner to
    one set of unit tests for all of the files instead, like
    runner='ruby mytests.rb'. Or even run something other than Ruby if
    you're perverse enough."""
    if runner is None: runner = 'ruby %s'
    for filename, event in FileWatcher(filenames):
        if message: print message
        if event != 'deleted' or '%s' not in runner:
            command = runner % filename if '%s' in runner else runner
            os.system(command)


if __name__ == '__main__':

    # ANSI terminal stuff knicked from my ansi.py since it's
    # convenient to make this module stand alone.

    prefix = '\x1b['

    home            = prefix + 'H'
    clear_to_bottom = prefix + 'J'
    clear_screen    = prefix + '2J' + home
    clear_to_eol    = prefix + 'K'

    save_cursor_pos = prefix + 's'
    restore_cursor_pos = prefix + 'u'

    show_cursor = prefix + '?25h'
    hide_cursor = prefix + '?25l'

    def goto(x, y):
        return prefix + ('%d;%dH' % (y+1, x+1))

    black, red, green, yellow, blue, magenta, cyan, white = range(8)

    def bright(color):
        return 60 + color

    reset = prefix + chr(0) + 'm'

    def set_foreground(color):
        return (prefix + '%dm') % (30 + color)

    def set_background(color):
        return (prefix + '%dm') % (40 + color)


    # Main program
    # Usage: sparkle.py [-r 'ruby runner'] file1.rb file2.rb...

    def darth_vader(says):
        return set_foreground(bright(magenta)) + says + reset

    import sys
    args = sys.argv[1:]
    runner = None
    if args[:1] == ['-r']:
        runner, args = args[1], args[2:]
    message = "Luke, I am your father. I'm watching you."
    try:
        ruby_autorun(args, runner=runner, message=darth_vader(message))
    except KeyboardInterrupt:
        pass
