import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import ButtonComponent from '../../components/button';
import TableComponent from '../../components/table/index.js';
import { headerCmv } from '../../entities/headers/header-cmv.js';
import CentralModal from '../../components/modal-central/index.js';
import { useUnidade } from '../../components/unidade-context/index.js';
import api from '../../services/api.js';
import { formatValor } from '../../utils/functions.js';
import CustomToast from '../../components/toast/index.js';
import { headerCmv2 } from '../../entities/headers/header-cmv2.js';
import Logo from '../../assets/png/logo_preta.png'
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import NumbersIcon from '@mui/icons-material/Numbers';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Edit, Print, ProductionQuantityLimits, Save } from '@mui/icons-material';
import PercentIcon from '@mui/icons-material/Percent';
import TopicIcon from '@mui/icons-material/Topic';
import { NumericFormat } from 'react-number-format';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SelectTextFields from '../../components/select/index.js';

const CMV = () => {
  const { unidadeId } = useUnidade();
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [totals, setTotals] = useState({ totalEntradas: 0, estoqueInicial: 0, estoqueFinal: 0, totalUtihandleEditarlizado: 0 });
  const [cadastro, setCadastro] = useState(false);
  const [editar, setEditar] = useState(false);
  const [cmvId, setCmvId] = useState(null);
  const [nome, setNome] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [lista, setLista] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [faturamento, setFaturamento] = useState('');
  const [produtosOriginais, setProdutosOriginais] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [cmv, setCmv] = useState(0);

  const userOptionsUnidade = [
    { value: 1, label: 'Kilograma' },
    { value: 2, label: 'Grama' },
    { value: 3, label: 'Litro' },
    { value: 4, label: 'Mililitro' },
    { value: 5, label: 'Unidade' },
  ];

  const produtosNaTabela = produtos.map(produto => produto.produtoId);
  const produtosFiltrados = produtosDisponiveis.filter(produto => !produtosNaTabela.includes(produto.id));


  const calculateTotals = (rows) => {
    const newTotals = rows.reduce((acc, row) => {
      const preco = Number(row.preco || 0);
      const estoqueInicial = Number(row.estoqueInicial || 0);
      const entrada = Number(row.entrada || 0);
      const estoqueFinal = Number(row.estoqueFinal || 0);

      acc.totalEntradas += entrada * preco;
      acc.estoqueInicial += estoqueInicial * preco;
      acc.estoqueFinal += estoqueFinal * preco;

      const utilizado = estoqueInicial + entrada - estoqueFinal;
      acc.totalUtilizado += utilizado * preco;

      return acc;
    }, { totalEntradas: 0, estoqueInicial: 0, estoqueFinal: 0, totalUtilizado: 0 });

    setTotals(newTotals);
  };
  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) {
      return 'R$ 0,00';
    }
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0,00%';
    }
    return `${(value).toFixed(2).replace('.', ',')}%`;
  };
  
  const handleCadastro = () => {
    setCadastro(true);
    carregaProdutos(unidadeId);
  };

  const handleEditar = (row) => {
    if (row) {
        setCmvId(row.id);
        setNome(row.nome || '');

        const faturamentoNumerico = parseFloat(row.faturamento.replace('R$', '').replace('.', '').replace(',', '.').trim());
        setFaturamento(isNaN(faturamentoNumerico) ? '' : faturamentoNumerico.toString());

        const valorCMV = parseFloat(row.valorCMV);
        setCmv(isNaN(valorCMV) ? 0 : valorCMV); 

        const mappedProdutos = row.itens.map(item => ({
            ...item,
            nome: item.produto.nome,
            preco: item.produto.valor,
        }));

        const newTotals = row.itens.reduce((acc, item) => {
            acc.totalEntradas += item.valorEntrada;
            acc.estoqueInicial += item.valorInicial;
            acc.estoqueFinal += item.valorEstoqueFinal;
            acc.totalUtilizado += item.valorUtilizado;
            return acc;
        }, { totalEntradas: 0, estoqueInicial: 0, estoqueFinal: 0, totalUtilizado: 0 });

        setProdutos(mappedProdutos);
        calculateTotals(mappedProdutos);
        setEditar(true);
    } else {
        console.error("Row data is undefined");
    }
};

  const handleCloseEditar = () => {
    clearFields();
    setEditar(false);
  };
  const handleCloseCadastro = () => {
    clearFields();
    setCadastro(false);
  };
  const handleRowChange = (updatedRows) => {
    const updatedWithUtilizado = updatedRows.map((row, index) => {
      const originalRow = produtos[index];
      const estoqueInicial = Number(row.estoqueInicial || 0);
      const estoqueFinal = Number(row.estoqueFinal || 0);
      const entrada = Number(row.entrada || 0);
      const preco = Number(row.preco || 0);

      const utilizado = estoqueInicial + entrada - estoqueFinal;

      if (utilizado < 0) {
        CustomToast({ type: "error", message: "O valor da coluna utilizado não pode ser negativo!" });

        return {
          ...originalRow,
          utilizado: 0,
          valorUtilizado: formatCurrency(0),
        };
      }

      const valorTotal = utilizado * preco;

      return {
        ...originalRow,
        estoqueInicial,
        estoqueFinal,
        entrada,
        utilizado,
        valorUtilizado: formatCurrency(valorTotal),
        nomeProduto: originalRow.nomeProduto,
      };
    });

    setProdutos(updatedWithUtilizado);
    calculateTotals(updatedWithUtilizado);
  };
  const handleRowChangeEditar = (updatedRows) => {
    const updatedWithUtilizado = updatedRows.map((row, index) => {
      const originalRow = produtos[index];
      const estoqueInicial = Number(row.estoqueInicial || 0);
      const estoqueFinal = Number(row.estoqueFinal || 0);
      const entrada = Number(row.entrada || 0);
      const preco = Number(row.preco || 0); 

      const utilizado = estoqueInicial + entrada - estoqueFinal;

      if (utilizado < 0) {
        CustomToast({ type: "error", message: "O valor da coluna utilizado não pode ser negativo!" });

        return {
          ...originalRow,
          utilizado: 0,
          valorUtilizado: formatCurrency(0),
        };
      }

      const valorTotal = utilizado * preco;

      return {
        ...originalRow,
        estoqueInicial,
        estoqueFinal,
        entrada,
        utilizado,
        valorUtilizado: formatCurrency(valorTotal), 
      };
    });

    setProdutos(updatedWithUtilizado);
    calculateTotals(updatedWithUtilizado);
  };

  const handlePrint = () => {
    if (!produtos || !Array.isArray(produtos)) {
      CustomToast({ type: "error", message: "Dados inválidos para impressão." });
      return;
    }

    const totals = produtos.reduce((acc, item) => {
      const preco = Number(item.preco || 0);
      const estoqueInicial = Number(item.estoqueInicial || 0);
      const entrada = Number(item.entrada || 0);
      const estoqueFinal = Number(item.estoqueFinal || 0);

      acc.estoqueInicial += estoqueInicial * preco;
      acc.totalEntradas += entrada * preco;
      acc.estoqueFinal += estoqueFinal * preco;
      const utilizado = estoqueInicial + entrada - estoqueFinal;
      acc.totalUtilizado += utilizado < 0 ? 0 : utilizado * preco;

      return acc;
    }, { estoqueInicial: 0, totalEntradas: 0, estoqueFinal: 0, totalUtilizado: 0 });

    const faturamentoFormatado = formatCurrency(Number(faturamento.replace('R$', '').replace('.', '').replace(',', '.')));
    const tableHTML = `
      <html>
        <head>
          <title>Imprimir CMV</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background-color: white;
              color: black;
              text-align: start;
            }
            .logo {
              width: 100%; 
              display: flex;
              justify-content: center;
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
          </style>
        </head>
        <body>
          <div class="logo">
            <img src="${Logo}" alt="Logo" onload="window.print()" /> <!-- Adiciona onload para imprimir após carregar a imagem -->
          </div>
          <h3>CMV: ${nome}</h3>
          <h3>Porcentagem: ${cmv.toFixed(2)}%</h3>
          <h3>Faturamento: ${faturamentoFormatado}</h3>
          <h3>Total:</h3>
          <ul>
            <li><label>Estoque Inicial: ${formatCurrency(totals.estoqueInicial)}</label></li>
            <li><label>Total Entradas: ${formatCurrency(totals.totalEntradas)}</label></li>
            <li><label>Estoque Final: ${formatCurrency(totals.estoqueFinal)}</label></li>
            <li><label>Total Utilizado: ${formatCurrency(totals.totalUtilizado)}</label></li>
          </ul>
          <table>
            <thead>
              <tr>
                ${headerCmv.map(header => `<th>${header.label}</th>`).join('')}
                <th>Preço</th>
              </tr>
            </thead>
            <tbody>
              ${produtos.map(item => {
      const estoqueInicial = Number(item.estoqueInicial || 0);
      const entrada = Number(item.entrada || 0);
      const estoqueFinal = Number(item.estoqueFinal || 0);
      const utilizado = estoqueInicial + entrada - estoqueFinal;
      const valorUtilizado = utilizado * (item.preco || 0);

      return `
                  <tr>
                    <td>${item.nome || "N/A"}</td>
                    <td>${item.categoria || "N/A"}</td>
                    <td>${formatCurrency(item.preco)}</td>
                    <td>${estoqueInicial}</td>
                    <td>${estoqueInicial}</td>
                    <td>${entrada}</td>
                    <td>${estoqueFinal}</td>
                    <td>${utilizado}</td>
                    <td>${formatCurrency(valorUtilizado)}</td>
                  </tr>
                `;
    }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');

    setTimeout(() => {
      printWindow.document.write(tableHTML);
      printWindow.document.close();
      printWindow.document.querySelector('img').onload = () => {
        printWindow.print();
      };
    }, 500);
  };

  const carregaProdutos = async (unidadeId) => {
    setLoading(true);
    try {
      const response = await api.get(`/produto?unidadeId=${unidadeId}`);
      if (Array.isArray(response.data.data)) {
        const produtosFiltrados = response.data.data.filter(produto => produto.unidadeId === unidadeId);
        const mappedProdutos = produtosFiltrados.map(produto => {
          const unidade = userOptionsUnidade.find(unit => unit.value === parseInt(produto.unidadeMedida));
          const valorFormatado = formatValor(produto.valorReajuste || produto.valor);

          return {
            id: produto.id,
            nome: produto.nome,
            rendimento: produto.rendimento,
            unidadeMedida: unidade ? unidade.label : 'N/A',
            categoria: produto.categoriaNome,
            valorPorcao: formatValor(produto.valorPorcao),
            valor: formatValor(produto.valorReajuste || produto.valor),
            preco: produto.valorReajuste || produto.valor,
            valorFormatado: valorFormatado,
            qtdMin: produto.qtdMin,
            categoriaId: produto.categoriaId,
            createdAt: new Date(produto.createdAt).toLocaleDateString('pt-BR'),
            categoriaNome: produto.categoriaNome
          };
        });
        setProdutos(mappedProdutos);
        setProdutosOriginais(mappedProdutos);
        setProdutosDisponiveis(mappedProdutos);
      } else {
        setProdutos([]);
        setProdutosOriginais([]);
        setProdutosDisponiveis([]);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasteData = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const pastedValues = text.split('\n').map(value => parseFloat(value)).filter(value => !isNaN(value));
      const updatedProducts = produtos.map((produto, index) => {
        if (pastedValues[index] !== undefined) {
          return {
            ...produto,
            estoqueInicial: pastedValues[index],
          };
        }
        return produto;
      });

      setProdutos(updatedProducts);
      calculateTotals(updatedProducts);
      CustomToast({ type: "success", message: "Dados colados com sucesso!" });
    } catch (err) {
      console.error('Erro ao colar os dados: ', err);
      CustomToast({ type: "error", message: "Erro ao colar os dados." });
    }
  };

  const handleCopyData = () => {
    const estoqueFinalValues = produtos.map(produto => produto.estoqueFinal).join('\n');
    navigator.clipboard.writeText(estoqueFinalValues)
      .then(() => {
        CustomToast({ type: "success", message: "Dados copiados com sucesso!" });
      })
      .catch(err => {
        console.error('Erro ao copiar os dados: ', err);
        CustomToast({ type: "error", message: "Erro ao copiar os dados." });
      });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {

      const faturamentoValue = parseFloat(faturamento.replace(',', '.')) || 0;

      const cmvData = {
        unidadeId: unidadeId,
        nome: nome,
        faturamento: faturamentoValue,
        valorCMV: cmv,
      };

      const produtosData = produtos.map(produto => ({
        estoqueInicial: produto.estoqueInicial,
        valorInicial: produto.preco * produto.estoqueInicial,
        entrada: produto.entrada,
        valorEntrada: produto.preco * produto.entrada,
        estoqueFinal: produto.estoqueFinal,
        valorEstoqueFinal: produto.preco * produto.estoqueFinal,
        utilizado: produto.utilizado,
        valorUtilizado: produto.preco * produto.utilizado,
        produtoId: produto.id,
      }));

      const response = await api.post('/cmv', {
        cmv: cmvData,
        produtos: produtosData,
      });

      if (response.data.status) {
        CustomToast({ type: "success", message: "CMV cadastrado com sucesso!" });
        clearFields();
        fetchCMVData();
        handleCloseCadastro();
      } else {
        CustomToast({ type: "error", message: response.data.message });
      }
    } catch (error) {
      CustomToast({ type: "error", message: "Erro ao cadastrar CMV." });
    } finally {
      setLoading(false);
    }
  };

  const clearFields = () => {
    setNome('');
    setFaturamento('');
    setProdutos([]);
    setTotals({ totalEntradas: 0, estoqueInicial: 0, estoqueFinal: 0, totalUtilizado: 0 });
    setCmv(0);
    setProdutoSelecionado('');
  };
  const handleDelete = (rowIndex) => {
    const updatedRows = produtos.filter((_, index) => index !== rowIndex);
    setProdutos(updatedRows);
    calculateTotals(updatedRows);
    CustomToast({ type: "success", message: "Produto removido com sucesso!" });
  };



  const handleSalvar = async () => {
    setLoading(true);
    try {
      const faturamentoValue = parseFloat(faturamento) || 0;

      const cmvData = {
        unidadeId: unidadeId,
        nome: nome,
        faturamento: faturamentoValue,
        valorCMV: cmv,
      };

      const produtosData = produtos.map(produto => ({
        estoqueInicial: produto.estoqueInicial,
        valorInicial: produto.preco * produto.estoqueInicial,
        entrada: produto.entrada,
        valorEntrada: produto.preco * produto.entrada,
        estoqueFinal: produto.estoqueFinal,
        valorEstoqueFinal: produto.preco * produto.estoqueFinal,
        utilizado: produto.utilizado,
        valorUtilizado: produto.preco * produto.utilizado,
        produtoId: produto.produtoId || produto.id,
      }));

      const response = await api.put(`/cmv/${cmvId}`, {
        cmv: cmvData,
        produtos: produtosData,
      });

      if (response.data.status) {
        CustomToast({ type: "success", message: "CMV atualizado com sucesso!" });
        clearFields();
        fetchCMVData();
        handleCloseEditar();
      } else {
        CustomToast({ type: "error", message: response.data.message });
      }
    } catch (error) {
      CustomToast({ type: "error", message: "Erro ao atualizar CMV." });
    } finally {
      setLoading(false);
    }
  };

  const handleApagar = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/cmv/${id}`);
      if (response.data.status) {
        CustomToast({ type: "success", message: "CMV deletado com sucesso!" });
        fetchCMVData();
      } else {
        CustomToast({ type: "error", message: response.data.message });
      }
    } catch (error) {
      CustomToast({ type: "error", message: "Erro ao deletar CMV." });
    } finally {
      setLoading(false);
    }
  };

  const fetchCMVData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/cmv?unidade_id=${unidadeId}`);
      if (response.data.status) {
        setLista(response.data.data);
      } else {
        CustomToast({ type: "error", message: response.data.message });
      }
    } catch (error) {
      CustomToast({ type: "error", message: "Erro ao buscar CMV." });
    } finally {
      setLoading(false);
    }
  };

  

  const formattedLista = lista.map(item => ({
    ...item,
    faturamento: formatValor(item.faturamento),
    valorCMV: `${item.valorCMV.toFixed(2).replace('.', ',')}%`,
  }));

  useEffect(() => {
    if (unidadeId && typeof unidadeId === 'number') {
      fetchCMVData();
    }
  }, [unidadeId]);
  const calculateCmv = () => {
    const totalUtilizado = totals.totalUtilizado;
    const faturamentoValue = parseFloat(faturamento) || 1;

    if (faturamentoValue === 0) {
        setCmv(0);
        return;
    }

    const cmvValue = (totalUtilizado / faturamentoValue) * 100;
    setCmv(Number(cmvValue));
};

  const handleAdicionarProduto = () => {
    if (produtoSelecionado) {
      const produto = produtosDisponiveis.find(p => p.id === produtoSelecionado);
      if (produto) {
        setProdutos(prev => [
          ...prev,
          {
            ...produto,
            nomeProduto: produto.nome,
            estoqueInicial: 0,
            entrada: 0,
            estoqueFinal: 0,
            utilizado: 0,
            valorUtilizado: formatCurrency(0),
            produtoId: produto.id,
          },
        ]);
        setProdutosDisponiveis(prev => prev.filter(p => p.id !== produtoSelecionado));
        setProdutoSelecionado(null);
      }
    }
  };

  useEffect(() => {
    if (faturamento) {
      calculateCmv();
    }
  }, [faturamento, totals]);

  useEffect(() => {
    if (unidadeId) {
      carregaProdutos(unidadeId);
      fetchCMVData(unidadeId);
    }
  }, [unidadeId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="flex w-full ">
      <Navbar />
      <div className='flex flex-col gap-3 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='justify-center  md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2  lg:w-[98%]'>
          <AddToQueueIcon /> CMV
        </h1>
        <div className={`mt-2 sm:mt-2 md:mt-9 flex flex-col w-full  transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          <div className='flex gap-2 flex-col ml-4 w-[95%]'>
            <div className='flex items-center gap-3'>
              <ButtonComponent
                startIcon={<AddCircleOutlineIcon fontSize='small' />}
                title={'Cadastrar'}
                subtitle={'Cadastrar'}
                buttonSize="large"
                onClick={handleCadastro}
              />

            </div>
            <div className='mt-2 w-[95%]'>
              <TableComponent
                headers={headerCmv2}
                rows={formattedLista}
                actionCalls={{
                  edit: (row) => handleEditar(row),
                  delete: (row) => handleApagar(row.id),
                }}
              />
            </div>
          </div>
        </div>
      </div>


      <CentralModal
        tamanhoTitulo={'82%'}
        maxHeight={'100vh'}
        top={'5%'}
        left={'5%'}
        width={'1200px'}
        icon={<AddToQueueIcon fontSize="small" />}
        open={cadastro}
        onClose={handleCloseCadastro}
        title="Cadastro de CMV"
      >
        <>
          <div className='flex items-center gap-3'>

            <div className=' w-[100%] md:w-[100%] lg:w-[100%] mt-5 md:mt-0 flex justify-center md:justify-start items-end gap-3 flex-wrap '>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Nome do CMV"
                sx={{ width: { xs: '100%', sm: '40%', md: '10%', lg: '30%' }, }}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TopicIcon />
                    </InputAdornment>
                  ),
                }}
                autoComplete="off"
              />
              <IconButton title="Colar Dados"
                onClick={handlePasteData}
                className='view-button w-10 h-10 '
                sx={{
                  color: 'black',
                  border: '1px solid black',
                  '&:hover': {
                    color: '#fff',
                    backgroundColor: '#BCDA72',
                    border: '1px solid black'
                  }
                }} >
                <ContentPasteGoIcon fontSize={"small"} />
              </IconButton>

              <div className=' w-[70%] md:w-[28%] lg:ml-[150px] flex justify-end'>
                <div className='w-[100%] sm:ml-0 md:w-[100%] lg:w-[60%] lg:first-letter: p-5 ' style={{ backgroundColor: '#BCDA72', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="large"
                    label="CMV"
                    name="CMV"
                    value={`${cmv.toFixed(2)}%`}
                    autoComplete="off"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon fontSize="large" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' },
                      fontSize: '20px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#1a894f',
                        },
                        '&:hover fieldset': {
                          borderColor: '#2563eb',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1a894f',
                        },
                        backgroundColor: '#f3f4f6',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#1a894f',
                        fontWeight: 700
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2563eb',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#006b33',
                      },
                    }}
                  />
                </div>
              </div>
              <div className='w-[70%] md:w-[28%] lg:w-[18%] p-5' style={{ backgroundColor: '#BCDA72', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                <NumericFormat
                  fullWidth
                  variant="outlined"
                  size="large"
                  label="Faturamento"
                  name="Faturamento"
                  value={faturamento ? formatValor(faturamento) : ''}
                  onValueChange={(values) => {
                    const { value } = values;
                    setFaturamento(value);
                  }}
                  autoComplete="off"
                  customInput={TextField}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon fontSize="large" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' },
                    fontSize: '20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#1a894f',
                      },
                      '&:hover fieldset': {
                        borderColor: '#2563eb',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1a894f',
                      },
                      backgroundColor: '#f3f4f6',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#1a894f',
                      fontWeight: 700,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2563eb',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#006b33',
                    },
                  }}
                />

              </div>
            </div>
          </div>

          <TableComponent
            headers={headerCmv}
            rows={produtos}
            onRowChange={handleRowChange}
            actionCalls={{
              tirar: handleDelete,
            }}
          />
          <div className='w-full flex items-center mt-3'>
            <label className='w-[22%] flex items-center justify-end mr-3  font-bold text-sm'>Total:</label>
            <div className=' md:flex flex-wrap items-center w-[70%] '>
              <span
                className=' w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center p-2 mr-12'
                style={{ backgroundColor: '#1a894f', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.estoqueInicial)}
              </span>

              <span
                className='w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center  mr-12 p-2'
                style={{ backgroundColor: '#2563eb', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.totalEntradas)}
              </span>

              <span
                className='w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center p-2 md:mr-12 lg:mr-5 '
                style={{ backgroundColor: '#69706c', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.estoqueFinal)}
              </span>
              <span
                className='w-[80%] md:w-[45%] lg:w-[15%] flex items-center text-sm font-bold justify-center p-2 '
                style={{ backgroundColor: '#BCDA72', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.totalUtilizado)} {/* Exibe o total utilizado formatado */}
              </span>
            </div>
          </div>
          <div className='flex justify-center w-[100%] mt-10'>
            <ButtonComponent
              title={'Cadastrar'}
              subtitle={'Cadastrar'}
              startIcon={<Save />}
              onClick={handleSubmit}
            />
          </div>
        </>
      </CentralModal>

      <CentralModal
        tamanhoTitulo={'84%'}
        maxHeight={'100vh'}
        top={'5%'}
        left={'5%'}
        width={'1200px'}
        icon={<Edit fontSize="small" />}
        open={editar}
        onClose={handleCloseEditar}
        title="Editar CMV"
      >
        <>
          <div className='flex items-center gap-3'>

            <div className=' w-[100%] md:w-[100%] lg:w-[100%] mt-5 md:mt-0 flex justify-center md:justify-start items-end gap-3 flex-wrap '>
              <div className='w-[40%]'>
                <div className='flex w-full gap-2'>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome do CMV"
                    sx={{ width: { xs: '100%', sm: '40%', md: '10%', lg: '40%' }, }}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TopicIcon />
                        </InputAdornment>
                      ),
                    }}
                    autoComplete="off"
                  />
                  <SelectTextFields
                    width={'150px'}
                    icon={<ProductionQuantityLimits fontSize="small" />}
                    label={'Selecionar Produto'}
                    backgroundColor={"#D9D9D9"}
                    name={"produto"}
                    options={produtosFiltrados.map(produto => ({
                      value: produto.id,
                      label: produto.nome,
                    }))}
                    value={produtoSelecionado}
                    onChange={(e) => setProdutoSelecionado(e.target.value)}
                  />
                  <IconButton title="Adicionar Produto"
                    onClick={handleAdicionarProduto}
                    className='view-button w-10 h-10 '
                    sx={{
                      color: 'black',
                      border: '1px solid black',
                      '&:hover': {
                        color: '#fff',
                        backgroundColor: '#BCDA72',
                        border: '1px solid black'
                      }
                    }} >
                    <AddCircleOutlineIcon fontSize={"small"} />
                  </IconButton>
                  <IconButton title="Imprimir"
                    onClick={handlePrint}
                    className='view-button w-10 h-10 '
                    sx={{
                      color: 'black',
                      border: '1px solid black',
                      '&:hover': {
                        color: '#fff',
                        backgroundColor: '#BCDA72',
                        border: '1px solid black'
                      }
                    }} >
                    <Print fontSize={"small"} />
                  </IconButton>
                  <IconButton title="Copiar Dados"
                    onClick={handleCopyData}
                    className='view-button w-10 h-10 '
                    sx={{
                      color: 'black',
                      border: '1px solid black',
                      '&:hover': {
                        color: '#fff',
                        backgroundColor: '#BCDA72',
                        border: '1px solid black'
                      }
                    }} >
                    <ContentCopyIcon fontSize={"small"} />
                  </IconButton>

                </div>

                <div className='w-[100%] flex gap-2 items-center'>


                </div>
              </div>

              <div className=' w-[70%] md:w-[28%] lg:ml-[100px] flex justify-end'>
                <div className='w-[100%] sm:ml-0 md:w-[100%] lg:w-[60%] lg:first-letter: p-5 ' style={{ backgroundColor: '#BCDA72', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="large"
                    label="CMV"
                    name="CMV"
                    value={typeof cmv === 'number' ? `${cmv.toFixed(2)}%` : '0.00%'}
                    autoComplete="off"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon fontSize="large" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' },
                      fontSize: '20px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#1a894f',
                        },
                        '&:hover fieldset': {
                          borderColor: '#2563eb',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1a894f',
                        },
                        backgroundColor: '#f3f4f6',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#1a894f',
                        fontWeight: 700
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2563eb',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#006b33',
                      },
                    }}
                  />
                </div>

              </div>
              <div className='w-[70%] md:w-[28%] lg:w-[18%] p-5' style={{ backgroundColor: '#BCDA72', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                <NumericFormat
                  fullWidth
                  variant="outlined"
                  size="large"
                  label="Faturamento"
                  name="Faturamento"
                  value={faturamento ? formatValor(faturamento) : ''}
                  onValueChange={(values) => {
                    const { value } = values;
                    setFaturamento(value);
                  }}
                  autoComplete="off"
                  customInput={TextField}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon fontSize="large" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' },
                    fontSize: '20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#1a894f',
                      },
                      '&:hover fieldset': {
                        borderColor: '#2563eb',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1a894f',
                      },
                      backgroundColor: '#f3f4f6',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#1a894f',
                      fontWeight: 700,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2563eb',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#006b33',
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <TableComponent
            headers={headerCmv}
            rows={produtos.map(produto => ({
              ...produto,
              valorUtilizado: formatCurrency(produto.utilizado * produto.preco), 
            }))}
            onRowChange={handleRowChangeEditar}
            actionCalls={{
              tirar: handleDelete,
            }}
          />
          <div className='w-full flex items-center mt-3'>
            <label className='w-[22%] flex items-center justify-end mr-3  font-bold text-sm'>Total:</label>
            <div className=' md:flex flex-wrap items-center w-[70%] '>
              <span
                className=' w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center p-2 mr-12'
                style={{ backgroundColor: '#1a894f', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.estoqueInicial)}
              </span>

              <span
                className='w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center mr-12 p-2'
                style={{ backgroundColor: '#2563eb', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.totalEntradas)}
              </span>

              <span
                className='w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center p-2 md:mr-12 lg:mr-5 '
                style={{ backgroundColor: '#69706c', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.estoqueFinal)}
              </span>
              <span
                className='w-[80%] md:w-[45%] lg:w-[15%] flex items-center text-sm font-bold justify-center p-2 '
                style={{ backgroundColor: '#BCDA72', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.totalUtilizado)}
              </span>
            </div>
          </div>
          <div className='flex justify-center w-[100%] mt-10'>
            <ButtonComponent
              title={'Salvar'}
              subtitle={'Salvar'}
              startIcon={<Save />}
              onClick={handleSalvar}
            />
          </div>
        </>
      </CentralModal>
    </div>
  );
};

export default CMV; 