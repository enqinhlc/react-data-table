import React from 'react';

const dataList = [{
    "_id": 1,
    "product_name": "sildenafil citrate",
    "supplier": "Wisozk Inc",
    "quantity": 261,
    "unit_cost": 109.47,
    "unit_cost_currency": "$"
}, {
    "_id": 2,
    "product_name": "Mountain Juniperus ashei",
    "supplier": "Keebler-Hilpert",
    "quantity": 292,
    "unit_cost": 800.74,
    "unit_cost_currency": "$"
}, {
    "_id": 3,
    "product_name": "Dextromathorphan HBr",
    "supplier": "Schmitt-Weissnat",
    "quantity": 211,
    "unit_cost": 240.53,
    "unit_cost_currency": "$"
}, {
    "_id": 4,
    "product_name": "Book Case",
    "supplier": "John Doe",
    "quantity": 923,
    "unit_cost": 894.53,
    "unit_cost_currency": "$"
}, {
    "_id": 5,
    "product_name": "Laptop Case",
    "supplier": "Jane Doe",
    "quantity": 9929,
    "unit_cost": 250,
    "unit_cost_currency": "$"
}];


const maxPrice = 1000;
const maxQuantity = 1000;
const dataCols = { id: 'ID', name: 'Name', supplier: 'Supplier', quantity: 'Quantity', cost: 'Cost' };
const compareFields = { name: 'product_name', id: '_id', quantity: 'quantity', supplier: 'supplier', cost: 'unit_cost' };
const compareFieldsReverse = { product_name: 'name', _id: 'id', quantity: 'quantity', supplier: 'supplier', unit_cost: 'cost' };

export default class Datatable extends React.Component {
    state = {
        dataList,
        sortedList: dataList,
        dataCols,
        sortType: 'id',
        sortRandASC: true,
        compareFields,
        compareFieldsReverse,
        searchFields: {
            id: "",
            name: "",
            quantity: maxQuantity,
            supplier: "",
            cost: maxPrice,
        },
        progressPercentage: 0
    }

    componentDidMount() {
        this.sort();
    }

    sortCompare = (a, b) => {
        const field = this.state.compareFields[this.state.sortType];
        if (a[field] < b[field])
            return -1;
        if (a[field] > b[field])
            return 1;
        return 0;
    }

    sort = () => {
        const { sortType, sortRandASC, dataList } = this.state;
        let sortedDataList = [];
        sortedDataList = this.filter(dataList);
        sortedDataList = sortedDataList.sort(this.sortCompare);
        if (!sortRandASC) sortedDataList = sortedDataList.reverse();

        this.setState(prevState => ({
            sortedList: sortedDataList
        }));
    }

    filter = (dataList) => {
        const { searchFields, compareFields, compareFieldsReverse } = this.state;

        return dataList.filter((data) => {
            let rowStatus = Object.keys(data).reduce((prevReduce, field) => {

                if (field in compareFieldsReverse && compareFieldsReverse[field] in searchFields) {
                    const value = data[field];
                    const compareFieldName = compareFieldsReverse[field];
                    const processField = searchFields[compareFieldName];

                    if (['cost', 'quantity'].includes(compareFieldName)) {
                        const numberStatus = value <= parseInt(processField);

                        if (prevReduce && !numberStatus) prevReduce = numberStatus;
                    } else {

                        const searchStatus = new RegExp(processField.toString(), 'i').test(value);
                        if ((processField.length > 0 && !searchStatus)) prevReduce = false
                    }
                }

                return prevReduce;
            }, true);

            return rowStatus;
        });
    }

    setSortType = (sortType) => {
        this.setState(prevState => {
            let nextState = { sortType, sortRandASC: true };
            if (prevState.sortType === sortType) nextState.sortRandASC = !prevState.sortRandASC
            return nextState;
        }, () => {
            this.sort();
        });
    }

    handleChange = ({ target }) => {
        this.setState(prevState => ({
            searchFields: {
                ...prevState.searchFields,
                [target.name]: target.value,
            }
        }), () => {
            this.sort();
        });
    };

    sortSign = (index) => {
        const { sortRandASC, sortType } = this.state;
        if (sortType === index)
            return `~ ${sortRandASC ? 'ASC' : 'DESC'}`

        return null;
    }

    table = () => {

        const { searchFields, dataCols, sortType, sortRandASC } = this.state;

        return (
            <div>
                Quantity Range: <input type="range" min={0} step={10} max={maxQuantity} name="quantity" value={searchFields.quantity} onChange={this.handleChange} />
                <br />
                Cost Range: <input type="range" min={0} step={10} max={maxPrice} name="cost" value={searchFields.cost} onChange={this.handleChange} />
                <br />
                <table>
                    <thead>
                        <tr>
                            {
                                Object.keys(dataCols).map((index, key) => <th key={key} onClick={this.setSortType.bind(this, index)}>{dataCols[index]} {this.sortSign(index)}</th>)
                            }
                        </tr>
                        <tr>
                            {
                                Object.keys(dataCols).map((index, key) => <th key={key}><input name={index} value={searchFields[index]} onChange={this.handleChange} /></th>)
                            }
                        </tr>
                        {
                            this.state.sortedList.map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{data._id}</td>
                                        <td>{data.product_name}</td>
                                        <td>{data.supplier}</td>
                                        <td>{data.quantity}</td>
                                        <td>{data.unit_cost_currency}{data.unit_cost}</td>
                                    </tr>
                                )
                            })
                        }
                    </thead>
                </table>
            </div>
        )
    }

    render() {
        return <this.table />
    }
}