# karma-transform-preprocessor
A preprocessor plugin for karma to facilitate content transformations for any file served by the karma server

## Why?

Because sometimes you just need to mangle a file before Karma should be allowed to get to it.
My specific use case was working around a third-party Polymer component which attempted to define
the `translate` function on itself. Apart from this conflicting with
Polymer base, the bigger issue is that this conflicts with a property
available on DOM elements. Some browsers, like Chrome (at time of
writing) permit smashing DOM element properties. Others, like QtWebKit (ie, in PhantomJs) do not, resulting in esoteric errors.

This plugin allows me to rewrite the declaration all uses of
`translate` to, for example, `__translate`, working around the
issue of CI tests running through PhantomJS failing when they don't
fail in Chrome.

But this preprocessor could be used for whatever you want -- perhaps
rewriting urls in html or data in JSON structures. It's all up to you.

## How to use?

1. You will need to add `karma-transform-preprocessor` to your `plugins` declaration in karma.conf.js, if it exists (I prefer explicit declaration of plugins and if you declare one, you must declare all the ones you want to use).
2. Add one or more `preprocessors` matchers, eg:
```
preprocessors: {
  "**/*.html": "transform"
}
```
3. Add one or more transformers to deal with your matches. Any files which are not matched are simply passed through unscathed. Transformers may be synchronous or asynchronous and are used preferentially by the order in which they are defined:
```
transformConfig: {
  transforms: [
    { match: /template1.html$/, transform: s => {
        return "<p>this is the new template1.html</p>";
      }
    },
    { match: /template2.html$/, transform: s => {
        return new Promise((resolve, reject) => {
          resolve("<p>this is the new template2.html</p>");
        });
      } 
    },
    { match: /late2.html$/, transform: s => {
        return "this will not match template2.html as it has lower precedence";
      }
    },
}
```

## Licensing
BSD 3 Clause. Basically, you can use it wherever you want for free. You can fork it, you can change it. You can even sell it. You just can't take credit for it.