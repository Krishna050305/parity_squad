import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState, useEffect, useCallback } from 'react'
// import ConnectWallet from './components/ConnectWallet'
import axios from 'axios'
import algokit_utils from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import { useSnackbar } from 'notistack'

// --- TYPES ---
interface LoanState {
  app_id: number
  borrower: string
  goal_amount: number
  funded_amount: number
  repaid_amount: number
  status: number
  deadline: number
  guarantor: string
}

const STATUS_MAP = {
  1: { label: 'OPEN', color: 'badge-primary' },
  2: { label: 'FUNDED', color: 'badge-secondary' },
  3: { label: 'REPAYING', color: 'badge-warning' },
  4: { label: 'CLOSED', color: 'badge-success' },
  5: { label: 'DEFAULTED', color: 'badge-error' },
}

const Home: React.FC = () => {
  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  const [loan, setLoan] = useState<LoanState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [fundAmount, setFundAmount] = useState<number>(0.1)

  const APP_ID = Number(import.meta.env.VITE_APP_ID || 1002)

  const fetchLoanData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/loans/${APP_ID}`)
      setLoan(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching loan data:', err)
      setError(`Failed to fetch loan state from backend: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [APP_ID])

  useEffect(() => {
    fetchLoanData()
    const interval = setInterval(fetchLoanData, 5000)
    return () => clearInterval(interval)
  }, [fetchLoanData])

  const handleFund = async () => {
    if (!activeAddress || !transactionSigner) return
    try {
      const algod = algokit_utils.getAlgoClient({
        server: 'http://localhost',
        port: '4001',
        token: 'a'.repeat(64),
      })
      
      const appAddr = algosdk.getApplicationAddress(BigInt(APP_ID))
      const amountMicroAlgos = BigInt(Math.round(fundAmount * 1_000_000))

      const params = await algod.getTransactionParams().do()
      const ptxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: activeAddress,
        receiver: appAddr,
        amount: amountMicroAlgos,
        suggestedParams: params,
      })

      const atc = new algosdk.AtomicTransactionComposer()
      const method = new algosdk.ABIMethod({
        name: 'fund_loan',
        args: [{ type: 'pay', name: 'payment' }],
        returns: { type: 'void' }
      })

      atc.addMethodCall({
        appID: BigInt(APP_ID),
        method: method,
        methodArgs: [{ txn: ptxn, signer: transactionSigner }],
        sender: activeAddress,
        signer: transactionSigner,
        suggestedParams: params,
        onComplete: 1 // OptInOC is 1
      })

      enqueueSnackbar('Sending funding transaction...', { variant: 'info' })
      await atc.execute(algod, 4)
      enqueueSnackbar('Successfully funded!', { variant: 'success' })
      fetchLoanData()
    } catch (err: any) {
      enqueueSnackbar(`Error: ${err.message}`, { variant: 'error' })
    }
  }

  const handleRepay = async () => {
    if (!activeAddress || !transactionSigner || !loan) return
    try {
        const algod = algokit_utils.getAlgoClient({
            server: 'http://localhost', port: '4001', token: 'a'.repeat(64)
        })
        const appAddr = algosdk.getApplicationAddress(BigInt(APP_ID))
        const params = await algod.getTransactionParams().do()
        
        const ptxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            sender: activeAddress,
            receiver: appAddr,
            amount: BigInt(loan.goal_amount), 
            suggestedParams: params,
        })

        const method = new algosdk.ABIMethod({
            name: 'repay_loan',
            args: [{ type: 'pay', name: 'payment' }],
            returns: { type: 'void' }
        })

        const atc = new algosdk.AtomicTransactionComposer()
        atc.addMethodCall({
            appID: BigInt(APP_ID), method, methodArgs: [{ txn: ptxn, signer: transactionSigner }],
            sender: activeAddress, signer: transactionSigner,
            suggestedParams: params,
        })

        await atc.execute(algod, 4)
        enqueueSnackbar('Loan fully repaid!', { variant: 'success' })
    } catch (err: any) {
        enqueueSnackbar(`Error: ${err.message}`, { variant: 'error' })
    }
  }

  const handleClaim = async () => {
    if (!activeAddress || !transactionSigner) return
    try {
        const algod = algokit_utils.getAlgoClient({
            server: 'http://localhost', port: '4001', token: 'a'.repeat(64)
        })
        const params = await algod.getTransactionParams().do()
        params.fee = BigInt(2000)
        params.flatFee = true

        const method = new algosdk.ABIMethod({
            name: 'claim_repayment',
            args: [],
            returns: { type: 'void' }
        })
        const atc = new algosdk.AtomicTransactionComposer()
        atc.addMethodCall({
            appID: BigInt(APP_ID), method, methodArgs: [],
            sender: activeAddress, signer: transactionSigner,
            suggestedParams: params,
        })
        await atc.execute(algod, 4)
        enqueueSnackbar('Funds claimed!', { variant: 'success' })
    } catch (err: any) {
        enqueueSnackbar(`Error: ${err.message}`, { variant: 'error' })
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-teal-400 font-bold">
        Loading LendPool Dashboard...
    </div>
  )

  if (error || !loan) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center flex-col p-6">
        <h1 className="text-3xl text-error mb-4 font-bold">System Error</h1>
        <p className="text-slate-400 text-center max-w-md">{error || "No active loan data received from blockchain."}</p>
        <button className="btn btn-outline border-teal-400 text-teal-400 mt-6" onClick={() => fetchLoanData()}>Retry</button>
    </div>
  )

  const progress = loan ? (loan.funded_amount / loan.goal_amount) * 100 : 0
  const status = loan ? (STATUS_MAP[loan.status as keyof typeof STATUS_MAP] || { label: 'UNKNOWN', color: 'badge-ghost' }) : { label: '?', color: '' }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold text-teal-400 tracking-tight">LendPool</h1>
            <p className="text-slate-400 mt-2">Community-Powered Mutual Lending</p>
          </div>
          <button className="btn btn-outline border-teal-400 text-teal-400" onClick={() => setOpenWalletModal(true)}>
            {activeAddress ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : 'Connect Wallet'}
          </button>
        </header>

        <section className="bg-slate-800 rounded-3xl p-10 border border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold">Active Loan #{APP_ID}</h2>
            <div className={`badge ${status.color} p-4 font-bold`}>{status.label}</div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="stat bg-slate-900 rounded-2xl p-6 border border-slate-700">
              <div className="stat-title text-slate-400 uppercase text-xs tracking-widest mb-2 font-bold">Goal Amount</div>
              <div className="stat-value text-3xl text-white">{loan.goal_amount / 1_000_000} ALGO</div>
            </div>
            <div className="stat bg-slate-900 rounded-2xl p-6 border border-slate-700">
              <div className="stat-title text-slate-400 uppercase text-xs tracking-widest mb-2 font-bold">Total Funded</div>
              <div className="stat-value text-3xl text-teal-400">{loan.funded_amount / 1_000_000} ALGO</div>
            </div>
            <div className="stat bg-slate-900 rounded-2xl p-6 border border-slate-700">
              <div className="stat-title text-slate-400 uppercase text-xs tracking-widest mb-2 font-bold">Total Repaid</div>
              <div className="stat-value text-3xl text-success">{loan.repaid_amount / 1_000_000} ALGO</div>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex justify-between mb-3 text-sm text-slate-400 font-bold uppercase tracking-wider">
                <span>Progress</span>
                <span>{progress.toFixed(1)}%</span>
            </div>
            <progress className="progress progress-primary w-full h-4 rounded-full" value={progress} max="100"></progress>
          </div>

          <div className="space-y-4">
            {loan.status === 1 && (
                <div className="flex gap-4 items-center">
                    <input 
                        type="number" 
                        className="input h-14 input-bordered bg-slate-900 w-32 border-slate-700 focus:border-teal-400 transition-all text-center font-bold text-xl" 
                        value={fundAmount} 
                        onChange={(e) => setFundAmount(Number(e.target.value))}
                    />
                    <button className="btn btn-primary flex-1 h-14 text-lg font-bold" onClick={handleFund}>Contribute ALGO</button>
                </div>
            )}

            {loan.status === 3 && activeAddress === loan.borrower && (
                <button className="btn btn-warning w-full h-14 text-lg font-bold" onClick={handleRepay}>Repay Loan</button>
            )}

            {loan.status === 4 && (
                <button className="btn btn-success w-full h-14 text-lg font-bold" onClick={handleClaim}>Claim Your Share</button>
            )}
            
            {(!activeAddress && (loan.status === 1 || loan.status === 3 || loan.status === 4)) && (
                <div className="bg-slate-900/50 p-4 rounded-xl text-center border border-dashed border-slate-700 text-slate-400 italic">
                    Connect your wallet to participate.
                </div>
            )}
          </div>
        </section>

        <footer className="mt-12 text-center text-slate-500 text-xs uppercase tracking-widest">
          LendPool Protocol | App ID: {APP_ID} | Borrower: {loan.borrower.slice(0, 10)}...
        </footer>
      </div>

      {/* <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} /> */}
    </div>
  )
}

export default Home
