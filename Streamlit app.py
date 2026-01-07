import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px

st.title("E-Wallet Security Dashboard")

# Your data (mock; replace with Firebase)
df = pd.DataFrame({
    'Date': pd.date_range(start='2026-01-01', periods=30, freq='D').strftime('%Y-%m-%d'),
    'Amount': np.random.uniform(50, 1000, 30).round(2),
    'Type': np.random.choice(['Send', 'Receive'], 30),
    'Currency': np.random.choice(['ETH', 'USDT'], 30)
})
df['Balance'] = df['Amount'].cumsum().round(2)

# Balance Line Chart
fig_balance = px.line(df, x='Date', y='Balance', title="Wallet Balance Over Time")
st.plotly_chart(fig_balance, use_container_width=True)[web:40]

# Transaction Bar Chart
fig_tx = px.bar(df, x='Date', y='Amount', color='Type', title="Daily Transactions (Send/Receive)")
st.plotly_chart(fig_tx, use_container_width=True)[web:40]

# Pie Chart: Currency Breakdown
fig_pie = px.pie(df, names='Currency', values='Amount', title="Transactions by Currency")
st.plotly_chart(fig_pie, use_container_width=True)
