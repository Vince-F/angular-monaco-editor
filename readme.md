# Monaco Editor for AngularJS

This AngularJS module provides yu with directive to integrate the Monaco Editor in your applications.

## Requirements
* AngularsJS (tested with 1.5.9 & 1.6.1, but should work for >1.3)
* Monaco Editor (tested with 0.8.1)

## Directives
To use the directives, you'll need to include the *anguComp.monacoEditor* module.

### angularMonacoEditor
This directive provides support for the standard editor.

#### Directive attributes
#### ng-model (*required*)
The model of the directive.

##### options (*optional*)
Options to customize the editor.

###### options.language
The language of the editor. Refer to your Monaco editor's documentation
to get a list of supported language.

**Default**: "javascript"

###### options.lineNumbers
Display/hide the line numbers.

**Default**: true

###### options.theme
The theme of the editor. Refer to your Monaco editor's document to get 
a list of theme.

**Default**: "vs-dark"

###### options.autoResize 
If true, automatically resize the editor. (Be careful, it could have performance
issue on your application).

**Default**:false

#### template-start (*optional*)
A read-only text which will pefix your code.
Note that it will not be included in your model.

**Default**:""

#### template-end (*optional*)
A read-only text which will suffix your code.
Note that it will not be included in your model.

**Default**: ""

#### editor-height (*optional*)
The height of the editor. Only pixel ("px") and percentage ("%") 
values are supported.

**Default**:"600px"

#### editor-width (*optional*)
The width of the editor. Only pixel ("px") and percentage ("%") 
values are supported.

**Default**:"800px"

#### ng-readonly (*optional*)
Set the code to read only.

**Default**:false

#### ng-disabled (*optional*)
Same as ng-readonly.


### angularMonacoDiffEditor
This directive provides support for the diff editor.

#### original (*required*)
The original content used for comparison. It will appear on
the left side.

#### modified (*required*)
The modified contnt used for comparison. It will appear on the
right side.

##### options (*optional*)
Options to customize the editor.

###### options.lineNumbers
Display/hide the line numbers.

**Default**: true

###### options.theme
The theme of the editor. Refer to your Monaco editor's document to get 
a list of theme.

**Default**: "vs-dark"

###### options.autoResize
If true, automatically resize the editor. (Be careful, it could have performance
issue on your application).

**Default**:false

#### editor-height (*optional*)
The height of the editor. Only pixel ("px") and percentage ("%") 
values are supported.

**Default**:"600px"

#### editor-width (*optional*)
The width of the editor. Only pixel ("px") and percentage ("%") 
values are supported.

**Default**:"800px"