const determinant = matrix => {

    if (matrix.length == 1) 
        return matrix[0][0]

    if (matrix.length == 2) 
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]

    if (matrix.length == 3)
        return (
            matrix[0][0] * matrix[1][1] * matrix[2][2] +
            matrix[1][0] * matrix[2][1] * matrix[0][2] +
            matrix[0][1] * matrix[1][2] * matrix[2][0] -
            matrix[0][2] * matrix[1][1] * matrix[2][0] -
            matrix[0][0] * matrix[2][1] * matrix[1][2] -
            matrix[1][0] * matrix[0][1] * matrix[2][2]
        )

    else if (matrix.length > 3) {
        let sum = 0

        for (let i = 0; i < matrix.length; i++)
            sum += matrix[0][i] * algebraicAddition(matrix, 0, i)

        return sum
    }
}

const deleteLine = (matrix, lineNumber) => {
    matrix.splice(lineNumber, 1)
    return matrix
}

const deleteColumn = (matrix, columnNumber) => {
    for (let i = 0; i < matrix.length; i++)
        matrix[i].splice(columnNumber, 1)

    return matrix
}

const removeLastColumn = matrix => {

    const new_matrix = []

    for (let i = 0 ; i < matrix.length; i++) {

        new_matrix[i] = []

        for (let j = 0; j < matrix.length; j++)
            new_matrix[i][j] = matrix[i][j]

    }

    return new_matrix
}

const getLastColumn = matrix => {
    const lastColumn = []

    const rows = matrix.length
    const columns = matrix[0].length

    for (let i = 0; i < rows; i++) 
        lastColumn[i] = matrix[i][columns-1]
    
    return lastColumn
}

const replaceColumn = (matrix, column, columnNumber) => {

    const rows = matrix.length
    const columns = matrix[0].length

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < columns; j++) {

            if (j == columnNumber) 
                matrix[i][j] = column[i]
                
        }

    }

    return matrix

}

const minor = (matrix, i, j) => {

    let dublicated_matrix = copy(matrix)

    dublicated_matrix = deleteLine(dublicated_matrix, i)

    dublicated_matrix = deleteColumn(dublicated_matrix, j)

    return determinant(dublicated_matrix)
}

const copy = matrix => {
    let dublicated_matrix = []

    for (let i = 0; i < matrix.length; i++) {
        dublicated_matrix[i] = []

        for (let j = 0; j < matrix.length; j++)
            dublicated_matrix[i][j] = matrix[i][j]

    }

    return dublicated_matrix
}

const algebraicAddition = (matrix, i, j) => (-1)**(i+j) * minor(matrix, i, j)

const validate = eq => {

    try {

        if (eq.length < 2 || eq.length > 8)
            throw new Error('В системе должно быть от 2 до 8 уравнений')

        let numberOfElementsInRows = eq.map( row => row.length )
    
        let numberOfElementInFirstRow = numberOfElementsInRows[0]

        numberOfElementsInRows.forEach(numberOfElementsInRow => {
            if (numberOfElementsInRow != numberOfElementInFirstRow)
                throw new Error('Количество уравнений и количество переменных должно совпадать')
        })
        
        const numberOfEquations = eq.length;
        const numberOfVariables = eq[0].length - 1

        if (numberOfVariables != numberOfEquations) 
            throw new Error('Количество уравнений и количество переменных должно совпадать')

    } catch(e) {
        throw(e)
    }
}

const Cramer = eq => {

    validate(eq)

    const mainDeterminant = calculateMainDeterminant(eq)

    if (mainDeterminant == 0) return Infinity

    let supportDeterminantes = []

    for (let i = 0; i < eq.length; i++) 
        supportDeterminantes.push( calculateSupportDeterminant(eq, i) )

    const equationRoots = supportDeterminantes.map 
        (supportDeterminant => supportDeterminant / mainDeterminant)
    
    return equationRoots
}

const calculateMainDeterminant = eq => {
    let matrix = removeLastColumn(eq)

    return determinant(matrix)
}

const calculateSupportDeterminant = (eq, n) => {

    const lastColumn = getLastColumn(eq)
    let matrix = removeLastColumn(eq)

    matrix = replaceColumn(matrix, lastColumn, n)

    return determinant(matrix)
}

// [-5, 6, 3, 2] ==================> -5x + 6y + 3z = 2

eq = [
    [-11, 12, 0, 3, 4, 7, 2, 1, -3],
    [7, -11, 2, 3, 46, 11, 1, 3, 2],
    [13, 21, -17, 3, 6, 13, 3, 0, 11],
    [27, 12, 10, 34, 2, 24, 4, 4, 21],
    [3, 100, 0, 4, 11, 12, 4, -9, 4],
    [2, 6, -7, -4, 21, 1, -4, -3, 2],
    [1, 2, 3, 4, 5, 12, 4, -9, 4],
    [1, -3, 4, 6, 12, -4, 3, 0, 1]
]

console.log( Cramer(eq) )

