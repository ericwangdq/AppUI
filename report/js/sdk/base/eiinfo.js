define(["jquery", "base/core"], function($, core) {

    var extend = $.extend,
        Class = core.Class,
        isAvailable = core.isAvailable,
        isNull = core.isNull,
        isUndefined = core.isUndefined,
        isString = core.isString;

    var AbstractEi = Class.extend({
        init: function() {
            this.extAttr = {};
        },
        get: function(name) {
            return this.extAttr[name];
        },
        set: function(name, value) {
            this.extAttr[name] = value;
        },
        getAttr: function() {
            return this.extAttr;
        },
        setAttr: function(attr) {
            this.extAttr = attr;
        }
    });

    var EiColumn = AbstractEi.extend({
        init: function(name) {
            AbstractEi.fn.init.call(this); // notice

            this.pos = -1;
            this.name = name;
            this.descName = "";
            this.type = "C";
            this.regex = null;
            this.formatter = null;
            this.editor = "text";
            this.minLength = 0;
            this.maxLength = Number.MAX_VALUE;
            this.primaryKey = false;
            this.nullable = false;
            this.visible = true;
            this.readonly = false;
            this.displayType = "text";
            this.errorPrompt = null;
            this.dateFormat = null;
            this.defaultValue = "";
            this.validateType = null;
            this.width = 96;
            this.height = 18;
            this.align = "left";
            this.blockName = null;
            this.sourceName = null;
            this.labelProperty = null;
            this.valueProperty = null;
        }
    });

    var EiBlockMeta = AbstractEi.extend({
        init: function(blockId) {
            AbstractEi.fn.init.call(this);
            this.blockId = blockId;
            this.metas = {};
            this.colCount = 0;
        },
        setDesc: function(desc) {
            this.desc = desc;
        },
        getDesc: function() {
            return this.desc;
        },
        addMeta: function(eiColumn) {
            if (eiColumn instanceof EiColumn) {
                this.metas[eiColumn.name] = eiColumn;
                if (eiColumn.pos < 0) {
                    eiColumn.pos = this.colCount;
                }
                this.colCount++;
            } else {
                throw  new Error("Can NOT add as an EiColumn.");
            }
        },
        getMeta: function(name) {
            return this.metas[name];
        },
        getBlockId: function() {
            return this.blockId;
        },
        getMetas: function() {
            return this.metas;
        }
    });

    var EiBlock = AbstractEi.extend({
        init: function(blockId) {
            AbstractEi.fn.init.call(this);

            if (isString(blockId)) {
                this.meta = new EiBlockMeta(blockId);
            } else if (blockId instanceof EiBlockMeta) {
                this.meta = blockId;
            } else {
                throw new Error("Can NOT create block.");
            }

            this.rows = []; // rows是二维数组
            this.colCount = 0;
        },
        getBlockMeta: function() {
            return this.meta;
        },
        setBlockMeta: function(blockMeta) {
            this.meta = blockMeta;
        },
        addRow: function(row) {
            if (isNull(row)) {
                this.rows.push({}); // FIXME: []
            } else {
                this.rows.push(row);
            }
        },
        getRows: function() {
            return this.rows;
        },
        setCell: function(rowNo, colName, value) {
            var pos = this.getBlockMeta().getMeta(colName).pos;
            while (isUndefined(this.rows[rowNo])) { // 循环加入空行
                this.addRow(null); // FIXME []
            }
            this.rows[rowNo][pos] = value;
        },
        getCell: function(rowNo, colName) {
            var eiColumn = this.getBlockMeta().getMeta(colName);
            if (eiColumn) {
                return this.rows[rowNo][eiColumn.pos];
            } else {
                return "";
            }
        },
        getCellByPos: function(rowNo, colPos) {
            return this.rows[rowNo][colPos];
        },
        getMappedArray: function(mappedObject) { // 把MappedObject转为数组
            var columns = this.getBlockMeta().getMetas(),
                row = [];
            for (var key in columns) {
                var pos = columns[key].pos;
                row[pos] = mappedObject[key];
            }
            return row;
        },
        getMappedObject: function(row) { // 把数组转为{"colName": value, ...}
            var columns = this.getBlockMeta().getMetas();
            var map = {};
            for (var key in columns ) {
                var column = columns[key];
                map[column.name] = row[column.pos];
            }
            return map;
        },
        getMappedRows: function() {
            var rows = [];
            for (var i = 0; i < this.rows.length; i++ ) {
                var map = this.getMappedObject(this.rows[i]);
                rows.push(m);
            }
            return rows;
        },
        clone: function() {
            var block = extend(true, {}, this);
            block.constructor = EiBlock;
            return block;
        }
    });

    var EiInfo = AbstractEi.extend({
        init: function(name) {
            AbstractEi.fn.init.call(this);
            this.name = null;
            this.msg = null;
            this.msgKey = null;
            this.status = null;
            this.descName = null;
            this.blocks = {};
            if (isString(name)) {
                this.name = name;
            }
        },
        getName: function() {
            return this.name;
        },
        setName: function(name) {
            this.name = name;
        },
        getMsg: function() {
            return this.msg;
        },
        setMsg: function(msg) {
            this.msg = msg;
        },
        getMsgKey: function() {
            return this.msgKey;
        },
        setMsgKey: function(msgKey) {
            this.msgKey = msgKey;
        },
        getDetailMsg: function() {
            return this.detailMsg;
        },
        setDetailMsg: function(detailMsg) {
            this.detailMsg = detailMsg;
        },
        getStatus: function() {
            return this.status;
        },
        setStatus: function(status) {
            this.status = status;
        },
        getDescName: function() {
            return this.descName;
        },
        setDescName: function(descName) {
            this.descName = descName;
        },
        addBlock: function(block) {
            this.blocks[block.getBlockMeta().getBlockId()] = block;
        },
        getBlock: function(blockId) {
            return this.blocks[blockId];
        },
        getBlocks: function() {
            return this.blocks;
        },
        set: function() { // override AbstractEi
            if (arguments.length === 2) { // set Einfo.extAttr [name, value]
                AbstractEi.prototype.set.apply(this, arguments);
                return;
            }

            var blockId = arguments[0],
                block = this.blocks[blockId];
            if (isUndefined(block)) {
                this.blocks[blockId] = block = new EiBlock(blockId);
            }
            if (arguments.length === 3) { // set EiBlock.extAttr [blockId, name, value]
                block.set(arguments[1], arguments[2]);
                return;
            }

            if (arguments.length == 4) { // set cell  [blockId, rowNo, colName, value]
                if (isUndefined(block.getBlockMeta().getMeta(arguments[2]))) {
                    var eiColumn = new EiColumn(arguments[2]);
                    eiColumn.pos = block.colCount++;
                    block.getBlockMeta().addMeta(eiColumn);
                }
                block.setCell(arguments[1], arguments[2], arguments[3]);
                return;
            }
        },
        setById: function(id) {
            this.setByNameValue(id, $("#" + id).val()); // FIXME: $(id)[0].value
        },
        setByNameValue: function(id, value) {
            var keys = id.split("-");
            if ( keys.length == 3) { // result-0-name EiBlock cell
                return this.set(keys[0], keys[1], keys[2], value);
            }
            if ( keys.length == 2) { // result-name EiBlock
                return this.set(keys[0], keys[1], value);
            }
            if ( keys.length == 1) { // name  EiInfo
                return this.set(keys[0], value);
            }
        },
        setByNode: function(id) { // DOM的Id 设置区域内的数据到EiInfo
            this.setByNodeObject($("#" + id));
        },
        setByNodeObject: function(node) { // DOM元素的值设置到EiInfo
            var inputs = $(node).find("input"), // TODO: $.val()
                selects = $(node).find("select"),
                textareas = $(node).find("textarea"),
                element;

            for (var i = 0; i < inputs.length; i++ ) {
                element = inputs[i][0];
                if ((element.type === "radio" || element.type === "checkbox") && !element.checked) {
                    continue;
                }
                this.setByNameValue(element.name || element.id, element.value ); // name or id
            }

            for (var i = 0; i < selects.length; i++ ) {
                element = selects[i][0];
                if (element.options.length > 0) {
                    this.setByNameValue(element.name || element.id, element.options[element.selectedIndex].value );
                }
            }
            for(var i = 0; i < textareas.length; i++) {
                element = textareas[i][0];
                this.setByNameValue(element.name || element.id, element.value);
            }
        }
    });

    // EiInfo 2 JSON
    var EIINFO = { // EIINFO
//        ATTRIBUTES: '"attr"',
//        EIINFO_NAME: '"name"',
//        EIINFO_DESC_NAME: '"descName"',
//        EIINFO_MESSAGE: '"msg"',
//        EIINFO_MESSAGE_KEY: '"msgKey"',
//        EIINFO_DETAIL_MESSAGE: '"detailMsg"',
//        EIINFO_STATUS: '"status"',
//        EIINFO_BLOCKS: '"blocks"',
//        BLOCK_META: '"meta"',
//        BLOCK_META_DESC: '"desc"',
//        BLOCK_META_COLUMNLIST: '"columns"',
//        BLOCK_META_COLUMNPOS: '"columnPos"',
//        BLOCK_DATA: '"rows"'
        ATTRIBUTES: "attr",
        EIINFO_NAME: "name",
        EIINFO_DESC_NAME: "descName",
        EIINFO_MESSAGE: "msg",
        EIINFO_MESSAGE_KEY: "msgKey",
        EIINFO_DETAIL_MESSAGE: "detailMsg",
        EIINFO_STATUS: "status",
        EIINFO_BLOCKS: "blocks",
        BLOCK_META: "meta",
        BLOCK_META_DESC: "desc",
        BLOCK_META_COLUMNLIST: "columns",
        BLOCK_META_COLUMNPOS: "columnPos",
        BLOCK_DATA: "rows"
    };

    var EiInfo2Json = {
        EiInfo2JsonString: function(eiInfo) {
            var jsonString = ['{'];

            if (isAvailable(eiInfo.getName())) {
//                jsonString.push(EIINFO.EIINFO_NAME, ':', JSON.stringify(eiInfo.getName()));
//                jsonString.push(',');
                jsonString.push('"', EIINFO.EIINFO_NAME, '":', JSON.stringify(eiInfo.getName()), ',');
            }
            if (isAvailable(eiInfo.getDescName())) {
//                jsonString.push(EIINFO.EIINFO_DESC_NAME, ':', JSON.stringify( eiInfo.getDescName()));
//                jsonString.push(',');
                jsonString.push('"', EIINFO.EIINFO_DESC_NAME, '":', JSON.stringify(eiInfo.getDescName()), ',');
            }

            if (isAvailable(eiInfo.getAttr())) {
//                jsonString.push(EIINFO.ATTRIBUTES, ':', JSON.stringify(eiInfo.getAttr()));
//                jsonString.push(',');
                jsonString.push('"', EIINFO.ATTRIBUTES, '":', JSON.stringify(eiInfo.getAttr()), ',');

            }

            jsonString.push('"', EIINFO.EIINFO_BLOCKS, '":{');
            var blocks = eiInfo.getBlocks(),
                hasBlock = false;

            for (var key in blocks){
                var block = blocks[key];
                jsonString.push('"', key, '":', this.EiBlock2JsonString(block));
                jsonString.push(',');
                hasBlock = true;
            }
            if (hasBlock) {
                jsonString.pop(); // pop ','
            }
            jsonString.push('}}');

            return jsonString.join('');

        },
        EiBlock2JsonString: function(eiBlock) {
            var jsonString = ['{'];

            jsonString.push('"', EIINFO.ATTRIBUTES, '":', JSON.stringify(eiBlock.getAttr()));
            jsonString.push(',"', EIINFO.BLOCK_META, '":', this.EiBlockMeta2JsonString(eiBlock.getBlockMeta()));
            jsonString.push(',"', EIINFO.BLOCK_DATA, '":[');

            var rows = eiBlock.getRows();
            for (var i = 0; i < rows.length; i++ ) {
                var row = rows[i];
                jsonString.push('['); // 转换行数据
                var columns = eiBlock.getBlockMeta().getMetas();
                for (var key in columns) {
                    var column = columns[key];
                    jsonString.push(JSON.stringify(row[column.pos]), ','); // row[column.pos] --> cellValue
                }
                jsonString.pop(); // pop ','
                jsonString.push('],');
            }
            jsonString.pop(); // pop '],'
            jsonString.push(']]}');

            return jsonString.join('');
        },
        EiBlockMeta2JsonString: function(blockMeta) {
            var jsonString = ['{'];
            if (isAvailable( blockMeta.getDesc())) {
                jsonString.push('"', EIINFO.BLOCK_META_DESC, '":', JSON.stringify(blockMeta.getDesc()));
                jsonString.push(',');
            }
            if (isAvailable(blockMeta.getAttr())) {
                jsonString.push('"', EIINFO.ATTRIBUTES, '":', JSON.stringify(blockMeta.getAttr()));
                jsonString.push(',');
            }
            jsonString.push('"', EIINFO.BLOCK_META_COLUMNLIST, '":[');

            var columns = blockMeta.getMetas();
            for (var key in columns) {
                var column = columns[key];
                jsonString.push(this.EiColumn2JsonString(column), ',');
            }
            jsonString.pop(); // 去除多余的','
            jsonString.push(']}');

            return jsonString.join('');
        },
        EiColumn2JsonString: function(eiColumn) { //TODO: 列信息丢失
            var jsonString = ['{'];
            jsonString.push( '"name"', ':', JSON.stringify(eiColumn.name)); // '"name"' JSON.parse
            jsonString.push( ',' );
            jsonString.push( '"descName"', ':', JSON.stringify(eiColumn.descName));
            jsonString.push('}');
            return jsonString.join('');
        },
        parseString: function(jsonString) {
            var json = eval("(" + jsonString + ")");
            return this.parseJsonObject(json);

        },
        parseJsonObject: function(json) {
            var eiInfo = new EiInfo();

            var value = json[EIINFO.EIINFO_NAME];
            if (isAvailable(value)) {
                eiInfo.setName(value);
            }

            var value = json[EIINFO.EIINFO_DESC_NAME];
            if (isAvailable(value)) {
                eiInfo.setDescName(value);
            }

            var value = json[EIINFO.EIINFO_MESSAGE];
            if (isAvailable(value) ) {
                eiInfo.setMsg(value);
            }

            var value = json[EIINFO.EIINFO_MESSAGE_KEY];
            if (isAvailable(value)) {
                eiInfo.setMsgKey(value);
            }

            var value = json[EIINFO.EIINFO_DETAIL_MESSAGE];
            if (isAvailable(value)) {
                eiInfo.setDetailMsg(value);
            }

            var value = json[EIINFO.EIINFO_STATUS];
            if (isAvailable(value)) {
                eiInfo.setStatus(value);
            }

            var value = json[EIINFO.ATTRIBUTES];
            if (isAvailable(value)){
                eiInfo.setAttr(value);
            }

            var value = json[EIINFO.EIINFO_BLOCKS];
            if (isAvailable(value)) {
                for (var blockId in value) {
                    var block = this.parseBlock(blockId, value[blockId]);
                    eiInfo.addBlock( block );
                }
            }

            return eiInfo;
        },
        parseBlock: function(blockId, json) {
            var block;
            var value = json[EIINFO.BLOCK_META];
            if (isAvailable(value)) {
                var blockMeta = this.parseBlockMeta(blockId, value);
                block = new EiBlock(blockMeta);
            } else {
                block = new EiBlock(blockId);
            }

            var value = json[EIINFO.ATTRIBUTES];
            if (isAvailable(value)) {
                block.setAttr(value);
            }

            var value = json[EIINFO.BLOCK_DATA];
            if (isAvailable(value)) {
                block.rows = value;
            }

            return block;
        },
        parseBlockMeta: function(blockId, json) {
            var blockMeta = new EiBlockMeta(blockId);

            var value = json[EIINFO.BLOCK_META_DESC];
            if (isAvailable(value)) {
                blockMeta.setDesc(value);
            }

            var value = json[EIINFO.ATTRIBUTES];
            if (isAvailable(value)) {
                blockMeta.setAttr(value);
            }

            var value = json[EIINFO.BLOCK_META_COLUMNLIST];
            if (isAvailable(value)) { // value should be Array
                for (var i = 0; i < value.length; i++ ) {
                    var column = this.parseColumn(value[i]);
                    blockMeta.addMeta(column);
                }
            }

            return blockMeta;
        },
        parseColumn: function(json) {
            var column = new EiColumn(json.name);

            for (var key in json) {
                var columnValue = json[key];
                if (columnValue.replace) {
                    columnValue = columnValue.replace(/'/g, "&#39;");
                }
                column[key] = columnValue;
//                eval("column." + key + "='" + columnValue + "'");
            }

            return column;
        },
        // standard REST transfer API
        parseRESTJSON: function(data/*Object*/, blockName/*String*/) {
            return this.parseRESTBlock(data.blocks[blockName]);
        },
        parseRESTBlock: function(block/*:Object*/) {
            var columns = block["meta"]["columns"],
                rows = block["rows"];

            var mappedRows = [];
            for (var i = 0; i < rows.length; i++ ) {
                var map = {};
                for (var j =0; j < columns.length; j++) {
                    var column = columns[j];
                    map[column.name] = rows[i][column.pos];
                }
                mappedRows.push(map);
            }
            return mappedRows;

        },
        parseSet: function(data, blockName) {
            data.attr[blockName] = this.parseRESTJSON(data, blockName);
        }
    };

    return {
        AbstractEi: AbstractEi,
        EiColumn: EiColumn,
        EiBlockMeta: EiBlockMeta,
        EiBlock: EiBlock,
        EiInfo: EiInfo,
        EiInfo2Json: EiInfo2Json
    };
});