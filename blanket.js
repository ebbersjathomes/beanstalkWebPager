require('blanket')({
	"pattern": "app.js",
    "data-cover-never": "[node_modules, /test]"
});