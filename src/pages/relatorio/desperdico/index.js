import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import HeaderRelatorio from '../../../components/navbars/relatorios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { InputAdornment, TextField } from '@mui/material';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import { AddCircleOutline, MoneyRounded, Numbers, Print } from '@mui/icons-material';
import { formatValor } from '../../../utils/functions';
import ButtonComponent from '../../../components/button';
import { headerDesperdicio } from '../../../entities/headers/header-desperdicio';
import TableComponent from '../../../components/table';
import SelectTextFields from '../../../components/select/index.js'; 
import { NumericFormat } from 'react-number-format';
import Logo from '../../../assets/png/logo_preta.png'

const Desperdicio = () => {
    const [produto, setProduto] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [precoRaw, setPrecoRaw] = useState(''); 
    const [produtos, setProdutos] = useState([]);
    const [desperdicioRows, setDesperdicioRows] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300); 

        return () => clearTimeout(timer);
    }, []);



    const handleAddDesperdicio = () => {
        if (!produto || !quantidade || !precoRaw) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const parsedPreco = parseFloat(precoRaw); 

        if (isNaN(parsedPreco) || parsedPreco <= 0) {
            alert("O valor do preço é inválido.");
            return;
        }

        const total = parsedPreco * parseInt(quantidade, 10);

        const newDesperdicio = {
            id: Date.now(),
            produto,
            quantidade,
            precoPorcao: parsedPreco,
            total: total,
            tipo: 'desperdicio', 
            dataCadastro: new Date().toISOString().split('T')[0] 
        };

        const updatedDesperdicioRows = [...desperdicioRows, newDesperdicio];
        setDesperdicioRows(updatedDesperdicioRows);
        localStorage.setItem('entradasSaidas', JSON.stringify(updatedDesperdicioRows)); 
        setProduto('');
        setQuantidade('');
        setPrecoRaw('');
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const tableHTML = `
            <html>
            <head>
                <title>Impressão de Desperdícios</title>
                <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            background-color: white;
                            color: black;
                            text-align: center;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px;
                        }
                        th, td { 
                            border: 1px solid #000;
                            padding: 8px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #f2f2f2;
                        }
                        img { 
                            width: 100px; 
                            height: auto; 
                            display: block;
                            margin: 0 auto;
                            background-color: black; /* Fundo preto na impressão */

                        }
                    </style>
            </head>
            <body>
             <img src="${Logo}" alt="Logo" />
                <h2>Relatório de Desperdício</h2>
                <table>
                    <thead>
                        <tr>
                            ${headerDesperdicio.map(header => `<th>${header.label}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${desperdicioRows.map(row => `
                            <tr>
                                <td>${row.produto}</td>
                                <td>${row.quantidade}</td>
                               <td>${formatValor(parseFloat(row.precoPorcao) || 0)}</td>
<td>${formatValor((parseFloat(row.precoPorcao) || 0) * (parseInt(row.quantidade, 10) || 0))}</td>

                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() { window.close(); };
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(tableHTML);
        printWindow.document.close();
    };
    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start   '>
                    <DeleteForeverIcon /> Desperdício
                </h1>
                <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                    <div className="hidden md:w-[14%] md:flex ">
                        <HeaderRelatorio />
                    </div>
                    <div className="w-[100%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col md:w-[80%]">
                        <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                            <SelectTextFields
                                width={'200px'}
                                icon={<LocalGroceryStoreIcon fontSize="small" />}
                                label={'Produto'}
                                backgroundColor={"#D9D9D9"}
                                name={"produto"}
                                fontWeight={500}
                                options={produtos.map(prod => ({ label: prod.nome, value: prod.nome }))}
                                onChange={(e) => setProduto(e.target.value)}
                                value={produto}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Quantidade"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '25%', sm: '50%', md: '40%', lg: '20%' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Numbers />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <NumericFormat
                                customInput={TextField}
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Preço"
                                sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '20%' } }}
                                value={precoRaw}
                                onValueChange={(values) => {
                     
                                    setPrecoRaw(values.floatValue || '');
                                }}
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="R$ "
                                decimalScale={2}
                                fixedDecimalScale={true}
                                allowNegative={false}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MoneyRounded />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <ButtonComponent
                                title="Adicionar"
                                subtitle="Adicionar"
                                startIcon={<AddCircleOutline />}
                                onClick={handleAddDesperdicio}
                            />
                            <ButtonComponent
                                title="Imprimir"
                                subtitle="Imprimir"
                                startIcon={<Print />}
                                onClick={handlePrint}
                            />

                        </div>
                        <div className={`w-[100%] md:w-[80%] flex-col flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                            <TableComponent
                                headers={headerDesperdicio}
                                rows={desperdicioRows.map(row => ({
                                    ...row,
                                    total: formatValor(row.precoPorcao * row.quantidade), 
                                    precoPorcao: formatValor(row.precoPorcao), 
                                    dataCadastro: new Date(row.dataCadastro).toLocaleDateString('pt-BR'),
                                }))}
                                actionsLabel={"Ações"} 
                                actionCalls={{
                              
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Desperdicio;