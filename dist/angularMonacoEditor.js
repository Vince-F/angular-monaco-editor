(function(){
    angular.module("anguComp.monacoEditor",[]);
})();;
(function(){
    angular.module("anguComp.monacoEditor")
        .directive("angularMonacoDiffEditor",angularMonacoDiffEditor);

    angularMonacoDiffEditor.$inject = ["$parse"];

    function angularMonacoDiffEditor($parse) {
        return {
            restrict: "EA",
            template:'',
            controller:function(){},
            controllerAs:"$ctrl",
            scope: {
                options:"=",
                editorHeight:"@",
                editorWidth:"@",
                original:"=",
                modified:"="
            },
            link:function(scope,element,attrs) {
                /* retrieve code container */
                var editor;
                var codeEditorElement = angular.element('<div class="code-container" style="height:600px;width:800px;"></div>');
                element.append(codeEditorElement);
                init();

                /* Monaco editor initialization */
                function initializeEditor() {
                    var options = attrs.options || {};
                    
                    editor = monaco.editor.createDiffEditor(codeEditorElement[0], {
                        lineNumbers: options.lineNumbers || true,
                        theme: options.theme || "vs-dark",
                        automaticLayout: options.autoResize || false
                    });

                    editor.setModel({
                        original: monaco.editor.createModel(scope.original, "text/javascript"),
                        modified: monaco.editor.createModel(scope.modified, "text/javascript")
                    });
                }

                function setEditorHeight() {
                    var height = "600px"; // default
                    if(scope.editorHeight.indexOf("%") === scope.editorHeight.length - 1 ||
                        scope.editorHeight.indexOf("px") === scope.editorHeight.length - 2) {
                        height = scope.editorHeight;
                    } // add warning message if format is incorrect
                    return height;
                }

                function setEditorWidth() {
                    var width = "800px"; // default
                    if(scope.editorWidth.indexOf("%") === scope.editorWidth.length - 1 ||
                        scope.editorWidth.indexOf("px") === scope.editorWidth.length - 2) {
                        width = scope.editorWidth;
                    } // add warning message if format is incorrect
                    return width;
                }

                function init() {
                    initializeEditor();
                }
            }
        }
    }
})();;
(function(){
    angular.module("anguComp.monacoEditor")
        .directive("angularMonacoEditor",angularMonacoEditor);

    angularMonacoEditor.$inject = ["$parse"];

    /**
     * @ngdoc directive
     * @name anguComp.monacoEditor.directive:angularMonacoEditor
     */
    function angularMonacoEditor($parse) {
        return {
            restrict: "EA",
            require:"ngModel",
            template:'',
            controller:function(){},
            controllerAs:"$ctrl",
            scope: {
                options:"=?",
                templateStart:"@",
                templateEnd:"@",
                editorHeight:"@",
                editorWidth:"@"
            },
            link:function(scope,element,attrs,ngModelCtrl) {
                var readOnly = $parse(attrs.ngReadonly)(scope.$parent) || $parse(attrs.ngDisabled)(scope.$parent) || false;

                attrs.$observe('readonly',function() {
                    readOnly = $parse(attrs.ngReadonly)(scope.$parent) || $parse(attrs.ngDisabled)(scope.$parent) || false;
                    updateReadOnly(readOnly);
                });

                attrs.$observe('disabled',function(){
                    readOnly = $parse(attrs.ngReadonly)(scope.$parent) || $parse(attrs.ngDisabled)(scope.$parent) || false;
                    updateReadOnly(readOnly);
                });

                attrs.$observe('templateStart',function() {
                    beginStaticCode = attrs.templateStart;
                    initStaticCode();
                    setEditableRange();
                    setEditorValue();
                });

                attrs.$observe('templateEnd',function() {
                    endStaticCode = attrs.templateEnd;
                    initStaticCode();
                    setEditableRange();
                    setEditorValue();
                });

                /* retrieve code container */
                var editor;
                var beginStaticCode = "";
                var endStaticCode = "";
                var beginStaticCodeLength = 0;
                var endStaticCodeLength = 0;
                var editorHeight = setEditorHeight();
                var editorWidth = setEditorWidth();
                var codeEditorElement = angular.element('<div class="code-container" style="height:' + editorHeight + ';width:' + editorWidth + ';"></div>');
                element.append(codeEditorElement);
                init();

                /* Monaco editor initialization */
                /**
                 * @ngdoc method
                 * @name initializeEditor
                 * @methodOf anguComp.monacoEditor.directive:angularMonacoEditor
                 * @private
                 * @description 
                 * create and initialize the code editor into its HTML node
                 */
                function initializeEditor() {
                    var options = scope.options || {};
                    
                    editor = monaco.editor.create(codeEditorElement[0], {
                        value: "",
                        language: options.language || "javascript",
                        lineNumbers: options.lineNumbers || true,
                        readOnly: readOnly,
                        theme: options.theme || "vs-dark",
                        automaticLayout: options.autoResize || false,
                        scrollBeyondLastLine: (options.scrollBeyondLastLine === false)?false:true
                    });
                    setEditorValue();
                }

                /**
                 * @ngdoc method
                 * @name initStaticCode
                 * @methodOf anguComp.monacoEditor.directive:angularMonacoEditor
                 * @private
                 * @description
                 * set the beginning and the end of the code as defined by template
                 */
                function initStaticCode() {
                    if(typeof attrs.templateStart === "string") {
                        beginStaticCodeLength = (attrs.templateStart.match(/\n/g) || []).length + 1;
                        beginStaticCode = attrs.templateStart + '\n';
                    }
                    if(typeof attrs.templateEnd === "string") {
                        endStaticCodeLength = (attrs.templateEnd.match(/\n/g) || []).length + 1;
                        endStaticCode = '\n' + attrs.templateEnd;
                    }
                }

                /**
                 * @ngdoc method
                 * @name setEditableRange
                 * @methodOf anguComp.monacoEditor.directive:angularMonacoEditor
                 * @private
                 * @description
                 * Set the template part to read only
                 */
                function setEditableRange() {
                    var lineStart = beginStaticCodeLength + 1;
                    var lineEnd = endStaticCodeLength;
                    var columnStart = 1;
                    var columnEnd = 99999; //should be enough, even for minified files I think
                    var lineCount = editor.getModel().getLineCount(); 
                    editor.getModel().setEditableRange(new monaco.Range(lineStart,columnStart,lineCount - lineEnd,columnEnd));
                }

                function setEditorHeight() {
                    var height = "600px"; // default
                    if( scope.editorHeight && (scope.editorHeight.indexOf("%") === scope.editorHeight.length - 1 ||
                        scope.editorHeight.indexOf("px") === scope.editorHeight.length - 2) ) {
                        height = scope.editorHeight;
                    } // add warning message if format is incorrect
                    return height;
                }

                function setEditorWidth() {
                    var width = "800px"; // default
                    if(scope.editorWidth && (scope.editorWidth.indexOf("%") === scope.editorWidth.length - 1 ||
                        scope.editorWidth.indexOf("px") === scope.editorWidth.length - 2) ) {
                        width = scope.editorWidth;
                    } // add warning message if format is incorrect
                    return width;
                }

                /* Monaco editor change listener initialization */
                function initializeModelUpdate() {
                    editor.onDidChangeModelContent(function(evt){
                        var code = editor.getValue();
                        if(beginStaticCodeLength > 0 || endStaticCodeLength > 0 ) {
                            var linesOfCode = code.split("\n");
                            linesOfCode.splice(0,beginStaticCodeLength);
                            linesOfCode.splice(-endStaticCodeLength,endStaticCodeLength);
                            code = linesOfCode.join("\n");
                        }
                        if(ngModelCtrl.$viewValue !== code && !(!ngModelCtrl.$viewValue && code.length === 0)) { //update only on change to avoid ngChange to be triggered when templateStart or templateEnd change
                            ngModelCtrl.$setViewValue(code);
                        }
                    });

                    ngModelCtrl.$render = function() {
                        // formatDocument(); // re indent code
                        setEditorValue();
                    }
                }

                function formatDocument() {
                    editor.trigger("angularDirective","editor.action.formatDocument");
                }

                function setEditorValue() {
                    var model = (ngModelCtrl.$viewValue === undefined)? "" : ngModelCtrl.$viewValue;
                    editor.setValue( "".concat(beginStaticCode, model, endStaticCode));
                    setEditableRange();
                }

                function init() {
                    initStaticCode();
                    initializeEditor();
                    initializeModelUpdate();
                    setEditableRange();
                }

                function updateOptions(newOptions) {
                    var options = newOptions || {};
                    editor.updateOptions({
                        language: options.language || "javascript",
                        lineNumbers: options.lineNumbers || true,
                        readOnly: readOnly,
                        theme: options.theme || "vs-dark",
                        automaticLayout: options.autoResize || false,
                        scrollBeyondLastLine: (options.scrollBeyondLastLine === false)?false:true
                    });
                }

                function updateReadOnly(readOnly) {
                    editor.updateOptions({
                        readOnly: readOnly
                    });
                }

                scope.$watchCollection('options',function(){
                    updateOptions(scope.options);
                },true);
            }
        }
    }
})();