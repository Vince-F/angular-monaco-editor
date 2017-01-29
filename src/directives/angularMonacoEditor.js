(function(){
    angular.module("anguComp.monacoEditor",[])
        .directive("angularMonacoEditor",angularMonacoEditor);

    angularMonacoEditor.$inject = ["$parse"]

    function angularMonacoEditor($parse) {
        return {
            restrict: "EA",
            require:"ngModel",
            template:'',
            controller:function(){},
            controllerAs:"$ctrl",
            scope: {
                options:"=",
                templateStart:"@",
                templateEnd:"@"
            },
            link:function(scope,element,attrs,ngModelCtrl) {
                var readOnly = $parse(attrs.ngReadonly)(scope.$parent) || $parse(attrs.ngDisabled)(scope.$parent) || false;
                /* retrieve code container */
                var editor;
                var beginStaticCode = "";
                var endStaticCode = "";
                var beginStaticCodeLength = 0;
                var endStaticCodeLength = 0;
                var codeEditorElement = angular.element('<div class="code-container" style="height:600px;width:800px;"></div>');
                element.append(codeEditorElement);
                init();

                /* Monaco editor initialization */
                function initializeEditor() {
                    var options = attrs.options || {};
                    var code = "".concat(beginStaticCode, ngModelCtrl.$viewValue, endStaticCode);
                    
                    editor = monaco.editor.create(codeEditorElement[0], {
                        value: code,
                        language: options.language || "javascript",
                        lineNumbers: options.lineNumbers || true,
                        readOnly: readOnly,
                        theme: options.theme || "vs-dark",
                    });
                }

                function initStaticCode() {
                    if(typeof scope.templateStart === "string") {
                        beginStaticCodeLength = (scope.templateStart.match(/\n/g) || []).length + 1;
                        beginStaticCode = scope.templateStart + '\n';
                    }
                    if(typeof scope.templateEnd === "string") {
                        endStaticCodeLength = (scope.templateEnd.match(/\n/g) || []).length + 1;
                        endStaticCode = '\n' + scope.templateEnd;
                    }
                }

                function setEditableRange() {
                    var lineStart = beginStaticCodeLength + 1;
                    var lineEnd = endStaticCodeLength;
                    var columnStart = 1;
                    var columnEnd = 99999; //should be enough, even for minified files I thing
                    var lineCount = editor.getModel().getLineCount(); 
                    console.log("editable range is from line ",lineStart, "to ",lineCount - lineEnd, " on a total of ",lineCount,"line");
                    editor.getModel().setEditableRange(new monaco.Range(lineStart,columnStart,lineCount - lineEnd,columnEnd));
                    var elems = document.querySelectorAll('[linenumber="1"]');
                    elems.forEach(function(el){ el.style.backgroundColor = "rgba(0,0,0,0.5)" } );
                }

                /* Monaco editor change listener initialization */
                function initializeModelUpdate() {
                    editor.onDidChangeModelContent(function(evt){
                        var code = editor.getValue();
                        if(beginStaticCodeLength > 0 || endStaticCodeLength > 0 ) {
                            var linesOfCode = code.split("\n");
                            linesOfCode.splice(0,beginStaticCodeLength);
                            linesOfCode.splice(-1,endStaticCodeLength);
                            code = linesOfCode.join("\n");
                        }
                        ngModelCtrl.$setViewValue(code);
                    });
                }

                function init() {
                    initStaticCode();
                    initializeEditor();
                    initializeModelUpdate();
                    setEditableRange();
                }
            }
        }
    }
})();