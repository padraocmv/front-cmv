import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  TextField,
  TablePagination
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { maskCPF } from '../../utils/formatCPF';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { Print } from '@mui/icons-material';

const TableComponent = ({ 
  rows, 
  headers, 
  actionCalls = {}, 
  actionsLabel, 
  onRowChange, 
  rowStyle, 
  selectedCheckboxes, 
  setSelectedCheckboxes 
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pageList, setPageList] = useState([]);
    const hasActions = Object.keys(actionCalls).length > 0;
    const actionTypes = Object.keys(actionCalls);
    const [totals, setTotals] = useState({ entrada: 0, estoqueInicial: 0, estoqueFinal: 0 });

    let headersList = hasActions
        ? headers.concat([{
            key: "actions",
            label: actionsLabel,
        }])
        : [...headers];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleInputChange = (rowIndex, key, value) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex][key] = value;
        setPageList(updatedRows);
        onRowChange && onRowChange(updatedRows);
    };

    const calculateTotals = (rows) => {
        const newTotals = rows.reduce((acc, row) => {
            acc.entrada += Number(row.entrada || 0);
            acc.estoqueInicial += Number(row.estoqueInicial || 0);
            acc.estoqueFinal += Number(row.estoqueFinal || 0);
            return acc;
        }, { entrada: 0, estoqueInicial: 0, estoqueFinal: 0 });
        setTotals(newTotals);
    };

    useEffect(() => {
        if (Array.isArray(rows)) {
            setPageList(rows);
            calculateTotals(rows);
        } else {
            console.error('As rows não são um array', rows);
            setPageList([]);
        }
    }, [rows]);
    
    const userTipo = localStorage.getItem('tipo');
    const location = useLocation();

    const renderActions = (row, rowIndex) => {
        let actions = {
            confirm: (
                row.status !== "Cadastrado" && (
                    <IconButton onClick={() => actionCalls.confirm(row)} title="Confirmar Registro"
                        className='confirm-button'
                        sx={{
                            color: '#BCDA72',
                            border: '1px solid #BCDA72',
                            '&:hover': {
                                color: '#fff',
                                backgroundColor: '#BCDA72',
                                border: '1px solid #005a2a'
                            }
                        }} >
                        <CheckCircleOutlineIcon fontSize={"small"} />
                    </IconButton>
                )
            ),
            view: (
                <IconButton onClick={() => actionCalls.view(row)} title="Visualizar Dados"
                    className='view-button'
                    sx={{
                        color: '#BCDA72',
                        border: '1px solid #BCDA72',
                        '&:hover': {
                            color: '#fff',
                            backgroundColor: '#BCDA72',
                            border: '1px solid #BCDA72'
                        }
                    }} >
                    <VisibilityOutlinedIcon fontSize={"small"} />
                </IconButton>
            ),
            edit: (
                <IconButton onClick={() => actionCalls.edit(row)} title="Editar Dados"
                    className='view-button'
                    sx={{
                        color: '#BCDA72',
                        border: '1px solid #BCDA72',
                        '&:hover': {
                            color: '#fff',
                            backgroundColor: '#BCDA72',
                            border: '1px solid #005a2a'
                        }
                    }} >
                    <EditIcon fontSize={"small"} />
                </IconButton>
            ),
            delete: (
                row.status !== "Pagamento Realizado" &&
                !(location.pathname.includes('/cadastro/produto') && String(localStorage.getItem('tipo')) === "3") && (
                    <IconButton onClick={() => actionCalls.delete(row)} title="Excluir Registro"
                        className='delete-button'
                        sx={{
                            color: '#9a0000',
                            border: '1px solid #9a0000',
                            '&:hover': {
                                color: '#fff',
                                backgroundColor: '#9a0000',
                                border: '1px solid #b22222'
                            }
                        }} >
                        <DeleteOutlineIcon fontSize={"small"} />
                    </IconButton>
                )
            ),
            tirar: (
                <IconButton onClick={() => actionCalls.tirar(rowIndex)} title="Excluir Registro"
                    className='delete-button'
                    sx={{
                        color: '#9a0000',
                        border: '1px solid #9a0000',
                        '&:hover': {
                            color: '#fff',
                            backgroundColor: '#9a0000',
                            border: '1px solid #b22222'
                        }
                    }} >
                    <CloseIcon fontSize={"small"} />
                </IconButton>
            ),
            inactivate: (
                <IconButton onClick={() => actionCalls.inactivate(row)} title={row.isAtivo ? "Inativar Registro" : "Reativar Registro"}
                    className='inactivate-button'
                    sx={{
                        color: row.isAtivo ? '#ff9800' : '#4caf50', 
                        border: `1px solid ${row.isAtivo ? '#ff9800' : '#4caf50'}`,
                        '&:hover': {
                            color: '#fff',
                            backgroundColor: row.isAtivo ? '#ff9800' : '#4caf50',
                            border: `1px solid ${row.isAtivo ? '#e68a00' : '#388e3c'}`
                        }
                    }} >
                    {row.isAtivo ? <BlockOutlinedIcon fontSize={"small"} /> : <CheckCircleOutlineIcon fontSize={"small"} />}
                </IconButton>
            ),
            print: (
                <IconButton onClick={() => actionCalls.print(row)} title="Imprimir"
                    className='inactivate-button'
                    sx={{
                        color: 'black',
                        border: '1px solid black',
                        '&:hover': {
                            color: '#fff',
                            backgroundColor: '#ff9800',
                            border: '1px solid #e68a00'
                        }
                    }} >
                    <Print fontSize={"small"} />
                </IconButton>
            ),
            option: (
                <IconButton onClick={() => actionCalls.option(row)} title="Iniciar Novo Contrato"
                    className='view-button'
                    sx={{
                        color: '#BCDA72',
                        border: '1px solid #BCDA72',
                        '&:hover': {
                            color: '#fff',
                            backgroundColor: '#BCDA72',
                            border: '1px solid #005a2a'
                        }
                    }} >
                    <AddCircleOutlineIcon fontSize={"small"} />
                </IconButton>
            ),
        };

        return actionTypes.map((action) => {
            const ActionButton = actions[action];
            return ActionButton ? (
                <span key={action}>
                    {ActionButton}
                </span>
            ) : null;
        });
    };

    useEffect(() => {
        setPageList(rows);
    }, [rows]);

    return (
        <Paper>
            <TableContainer style={{ maxHeight: '430px', overflowY: 'auto' }} className='scrollbar'>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {headersList.map(({ key, label, sort }) => (
                                sort !== false && (
                                    <TableCell key={key} style={{
                                        fontWeight: 'bold',
                                        textAlign: key === 'actions' ? 'center' : 'left'
                                    }}>{label}</TableCell>
                                )
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {(rowsPerPage > 0
                            ? pageList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : pageList
                        ).map((row, rowIndex) => (
                            <TableRow key={rowIndex} style={rowStyle ? rowStyle(row) : {}}>
                                {headersList.map(({ key, label, sort, type }) => (
                                    sort !== false && (
                                        key === "actions" && hasActions ? (
                                            <TableCell key={key} style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                                                {renderActions(row, rowIndex)} 
                                            </TableCell>
                                        ) : type === 'checkbox' ? (
                                            <TableCell key={key}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCheckboxes[row.produto] || false}  
                                                    onChange={(e) => {
                                                        const updatedSelectedCheckboxes = { ...selectedCheckboxes };
                                                        if (e.target.checked) {
                                                            updatedSelectedCheckboxes[row.produto] = true; 
                                                        } else {
                                                            delete updatedSelectedCheckboxes[row.produto]; 
                                                        }
                                                        setSelectedCheckboxes(updatedSelectedCheckboxes);
                                                    }}
                                                />
                                            </TableCell>
                                        ) : key === "tipo" ? (
                                            <TableCell key={key} style={{
                                                backgroundColor: row.tipo === 'entrada' ? '#006b33' :
                                                    row.tipo === 'saida' ? '#ff0000' :
                                                        row.tipo === 'desperdicio' ? '#000000' : 'transparent',
                                                color: '#fff'
                                            }}>
                                                {row.tipo === "3" ? "Desperdício" : row[key]}
                                            </TableCell>
                                        ) : key === "entrada" || key === "estoqueInicial" || key === "estoqueFinal" ? (
                                            <TableCell key={key}>
                                                <TextField
                                                    type="number"
                                                    value={row[key] || ''}
                                                    onChange={(e) => handleInputChange(rowIndex, key, e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </TableCell>
                                        ) : key === "cpf" ? (
                                            <TableCell style={{ fontSize: '12px' }} key={key}>{maskCPF(row[key])}</TableCell>
                                        ) : (
                                            <TableCell style={{ fontSize: '12px' }} key={key}>{row[key] || "-"}</TableCell>
                                        )
                                    )
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                component="div"
                count={pageList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Linhas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
            />
        </Paper>
    );
};

export default TableComponent;