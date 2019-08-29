import PageContent from '@/layouts/page-content';
import {ToolBar, QueryBar, Table} from '@/library/components';
import uuid from "uuid/v4";
import {isJson} from "@/library/utils";
import {getIndentSpace, INDENT_SPACE, propsToString, valueToString} from '../utils';
import _ from "lodash";

export const category = '自定义组件';

const columnsValidator = {
    validator: (rule, value, callback) => {
        if (!value) return callback();

        const isJsonStr = isJson(value);
        if (!isJsonStr) return callback('请输入正确的JSON各式数据');

        const options = JSON.parse(value);
        if (!_.isArray(options)) return callback('整体数据必须是数组');

        for (let i = 0; i < options.length; i++) {
            const val = options[i];
            if (!_.isPlainObject(val)) return callback('每一项必须是包含title、dataIndex属性的对象');

            if (!('title' in val && 'dataIndex' in val)) return callback('每一项必须是包含title、dataIndex属性的对象');

            const titles = options.filter(item => item.title === val.title);
            if (titles.length > 1) return callback(`"title": "${val.title}" 已存在，title值不可重复`);

            const dataIndexes = options.filter(item => item.dataIndex === val.dataIndex);
            if (dataIndexes.length > 1) return callback(`"dataIndex": "${val.dataIndex}" 已存在，dataIndex值不可重复`);
        }

        return callback();
    }
};

function getTableMockDataSource() {
    const dataSource = [];
    const rowCount = 5;
    const columnCount = 10;
    for (let i = 0; i < rowCount; i++) {
        const data = {key: `${i}`, name: '张三', age: 23};
        for (let j = 0; j < columnCount; j++) {
            data[`dataIndex${j}`] = j;
        }
        dataSource.push(data)
    }

    return dataSource;
}

export default {
    PageContent: {
        component: PageContent,
        title: '页面容器',
        container: true,
        visible: false,
        import: 'import PageContent from \'@/layouts/page-content\'',
        description: '页面统一容器。',
        defaultProps: {
            children: [
                {
                    __type: 'div',
                    __id: uuid(),
                    children: [
                        {
                            __type: 'text',
                            __id: uuid(),
                            content: '页面容器',
                        }
                    ],
                }
            ],
        },
    },
    ToolBar: {
        component: ToolBar,
        title: '工具条',
        container: true,
        direction: 'horizontal',
        dependence: '@/library/components',
        description: '工具容器，一般内部是一些按钮。',
        defaultProps: {
            children: [
                {
                    __type: 'Button',
                    __id: uuid(),
                    type: 'primary',
                    children: [
                        {
                            __type: 'text',
                            __id: uuid(),
                            content: '工具条',
                        }
                    ],
                },
                {
                    __type: 'Button',
                    __id: uuid(),
                    type: 'danger',
                    children: [
                        {
                            __type: 'text',
                            __id: uuid(),
                            content: '工具条',
                        }
                    ],
                },
            ],
        },
    },
    QueryBar: {
        component: QueryBar,
        title: '查询条件',
        container: true,
        direction: 'horizontal',
        dependence: '@/library/components',
        description: '用于包裹一些查询条件的容器。',
        defaultProps: {
            children: [
                {
                    __type: 'FormRow',
                    __id: uuid(),
                    children: [
                        {
                            __type: 'FormInput',
                            __id: uuid(),
                            label: '输入框',
                            style: {paddingLeft: 16},
                            width: '200px',
                        },
                        {
                            __type: 'FormSelect',
                            __id: uuid(),
                            type: 'select',
                            label: '下拉框',
                            style: {paddingLeft: 16},
                            width: '200px',
                            options: [
                                {value: '1', label: '下拉项1'},
                                {value: '2', label: '下拉项2'},
                            ],
                        },
                        {
                            __type: 'FormElement',
                            __id: uuid(),
                            layout: true,
                            style: {paddingLeft: 16},
                            width: 'auto',
                            children: [
                                {
                                    __type: 'Button',
                                    __id: uuid(),
                                    type: 'primary',
                                    style: {marginRight: 8},
                                    children: [
                                        {
                                            __type: 'text',
                                            __id: uuid(),
                                            content: '查询',
                                        }
                                    ],
                                },
                                {
                                    __type: 'Button',
                                    __id: uuid(),
                                    type: 'default',
                                    children: [
                                        {
                                            __type: 'text',
                                            __id: uuid(),
                                            content: '重置',
                                        }
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    Table: {
        component: Table,
        title: '表格',
        dependence: '@/library/components',
        container: false,
        defaultProps: {
            columns: [
                {title: '姓名', dataIndex: 'name', width: 100,},
                {title: '年龄', dataIndex: 'age', width: 100},
                {title: '操作', dataIndex: '__operator'},
            ],
            dataSource: getTableMockDataSource(),
            total: 50,
        },
        toSource: options => {
            const {
                tagName,
                states,
                initStates,
                attributes,
                __indent,
                props: {
                    columns,
                    dataSource,
                    total,
                    children,
                    rowSelection,
                    ...props
                }
            } = options;
            const indentSpace1 = getIndentSpace(__indent);
            const indentSpace2 = getIndentSpace(__indent + INDENT_SPACE);
            const indentSpace3 = getIndentSpace(__indent + INDENT_SPACE * 2);

            const columnsValueStr = valueToString(columns, INDENT_SPACE);
            const dataSourceValueStr = valueToString(dataSource, INDENT_SPACE * 2);
            const totalValueStr = valueToString(total, INDENT_SPACE * 2);

            initStates.push(`dataSource: ${dataSourceValueStr}`);
            initStates.push(`total: ${totalValueStr}`);
            states.push('dataSource');
            states.push('total');

            attributes.push(`columns = ${columnsValueStr};`);

            if (rowSelection) {
                /*
                * rowSelection={{
                        selectedRowKeys,
                        onChange: selectedRowKeys => this.setState({selectedRowKeys}),
                    }}
                * */
                initStates.push('selectedRowKeys: []');
                states.push('selectedRowKeys');
                props.rowSelection = `{
${indentSpace3}selectedRowKeys,
${indentSpace3}onChange: selectedRowKeys => this.setState({selectedRowKeys}),
${indentSpace2}}`
            }

            const propsString = propsToString({
                ...props,
                columns: 'this.columns',
                dataSource: 'this.state.dataSource',
                total: 'this.state.total',
            }, __indent + INDENT_SPACE, true);

            return `<${tagName}${propsString}/>`
        },
        props: [
            {
                name: '分页',
                attribute: 'pagination',
                valueType: 'boolean',
                defaultValue: true,
                formType: 'switch',
                checkedChildren: '是',
                unCheckedChildren: '否',
                half: true,
            },
            {
                name: '铺面全屏',
                attribute: 'surplusSpace',
                valueType: 'boolean',
                defaultValue: true,
                formType: 'switch',
                checkedChildren: '是',
                unCheckedChildren: '否',
                half: true,
            },
            {
                name: '可选择',
                attribute: 'rowSelection',
                valueType: 'boolean',
                formType: 'switch',
                checkedChildren: '是',
                unCheckedChildren: '否',
                half: true,
            },
            {
                name: '显示序号',
                attribute: 'serialNumber',
                valueType: 'boolean',
                formType: 'switch',
                checkedChildren: '是',
                unCheckedChildren: '否',
                half: true,
            },
            {
                name: '列配置',
                attribute: 'columns',
                valueType: 'json',
                formType: 'json',
                height: '200px',
                defaultValue: [
                    {title: '姓名', dataIndex: 'name', width: 100,},
                    {title: '年龄', dataIndex: 'age', width: 100},
                    {title: '操作', dataIndex: '__operator'},
                ],
                rules: [
                    columnsValidator,
                ],
                tabSize: 2,
                labelBlock: true,
            },
        ],
    },
};
