#!/usr/bin/env python3
from html.parser import HTMLParser
import os
import sys

class PrettyHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.indent = 0
        self.lines = []
        self.void_tags = set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'])
        self.preserve_tags = set(['pre','code','textarea','script','style'])
        self._preserve = []
        self._last_was_data = False

    def handle_decl(self, decl):
        self.lines.append(f"<!{decl}>")

    def handle_comment(self, data):
        self._append_line(f"<!--{data}-->")

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        attrs_str = ''.join([f' {name}="{value}"' if value is not None else f' {name}' for name, value in attrs])
        line = f"<{tag}{attrs_str}>"
        self._append_line(line)
        if tag in self.preserve_tags:
            self._preserve.append(tag)
        if tag not in self.void_tags:
            self.indent += 1
        self._last_was_data = False

    def handle_startendtag(self, tag, attrs):
        tag = tag.lower()
        attrs_str = ''.join([f' {name}="{value}"' if value is not None else f' {name}' for name, value in attrs])
        line = f"<{tag}{attrs_str} />"
        self._append_line(line)
        self._last_was_data = False

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in self.preserve_tags and self._preserve:
            try:
                self._preserve.pop()
            except Exception:
                pass
        self.indent = max(self.indent - 1, 0)
        self._append_line(f"</{tag}>")
        self._last_was_data = False

    def handle_data(self, data):
        if not data:
            return
        if self._preserve:
            # inside pre/script/style -> keep as-is
            self.lines.append(data)
            return
        # normalize whitespace and skip purely whitespace
        if data.strip() == '':
            return
        for line in data.splitlines():
            t = line.strip()
            if t == '':
                continue
            self._append_line(t)
        self._last_was_data = True

    def handle_entityref(self, name):
        self._append_line(f"&{name};")

    def handle_charref(self, name):
        self._append_line(f"&#{name};")

    def _append_line(self, text):
        indent_str = '  ' * self.indent
        # If last appended line was a tag opening and now we append text, keep same indent
        self.lines.append(indent_str + text)

    def format(self, html_text):
        # Reset state
        self.indent = 0
        self.lines = []
        self._preserve = []
        self._last_was_data = False
        try:
            self.feed(html_text)
            self.close()
        except Exception as e:
            # fallback: return original
            return html_text
        return '\n'.join(self.lines) + '\n'


def format_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    p = PrettyHTML()
    out = p.format(content)
    # Simple post-clean: ensure DOCTYPE and html tag remain at top if present
    with open(path, 'w', encoding='utf-8') as f:
        f.write(out)
    print(f"Formatted: {path}")


def main():
    base = os.path.normpath(os.path.join(os.path.dirname(__file__), '..'))
    for name in os.listdir(base):
        if name.lower().endswith('.html'):
            path = os.path.join(base, name)
            try:
                format_file(path)
            except Exception as e:
                print('Error formatting', path, e, file=sys.stderr)

if __name__ == '__main__':
    main()
