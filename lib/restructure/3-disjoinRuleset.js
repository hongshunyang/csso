var List = require('css-tree').List;
var walkRulesRight = require('css-tree').walkRulesRight;

function processRule(node, item, list) {
    var selectors = node.prelude.children;

    // generate new rule sets:
    // .a, .b { color: red; }
    // ->
    // .a { color: red; }
    // .b { color: red; }

    // while there are more than 1 simple selector split for rulesets
    while (selectors.head !== selectors.tail) {
        var newSelectors = new List();
        newSelectors.insert(selectors.remove(selectors.head));

        list.insert(list.createItem({
            type: 'Rule',
            loc: node.loc,
            prelude: {
                type: 'SelectorList',
                loc: node.prelude.loc,
                children: newSelectors
            },
            block: {
                type: 'Block',
                loc: node.block.loc,
                children: node.block.children.copy()
            },
            pseudoSignature: node.pseudoSignature
        }), item);
    }
}

module.exports = function disjoinRule(ast) {
    walkRulesRight(ast, function(node, item, list) {
        if (node.type === 'Rule') {
            processRule(node, item, list);
        }
    });
};