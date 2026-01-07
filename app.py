import streamlit as st
import pandas as pd
import numpy as np

st.title("🔐 E-Wallet Security Dashboard")

# Your wallet data
df = pd.DataFrame({
    'Date': pd.date_range(start='2026-01-01', periods=30, freq='D').strftime('%Y-%m-%d'),
    'Amount': np.random.uniform(50, 1000, 30).round(2),
    'Type': np.random.choice(['Send', 'Receive', 'Honeypot'], 30, p=[0.5, 0.4, 0.1]),
    'Currency': np.random.choice(['ETH', 'USDT'], 30)
})
df['Balance'] = df['Amount'].cumsum().round(2)

# Native charts only
st.subheader("📈 Balance Over Time")
st.line_chart(df.set_index('Date')[['Balance', 'Amount']])

st.subheader("💸 Daily Transactions by Type")
tx_pivot = df.pivot_table(values='Amount', index='Date', columns='Type', aggfunc='sum', fill_value=0)
st.bar_chart(tx_pivot)

st.subheader("💰 Currency Breakdown (Bar)")
currency_sum = df.groupby('Currency')['Amount'].sum()
st.bar_chart(currency_sum)

st.subheader("📋 Recent Transactions")
st.dataframe(df.head(15))
