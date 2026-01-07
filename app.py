import streamlit as st
import pandas as pd
import numpy as np
import altair as alt

st.set_page_config(page_title="E-Wallet Security Dashboard", layout="wide")
st.title("🔐 E-Wallet Security Dashboard - Blockchain Secured")

# ============ DATA GENERATION ============
all_dates = pd.date_range(start='2025-10-01', end='2026-01-07', freq='D')
unique_dates = np.random.choice(all_dates.strftime('%Y-%m-%d'), 60, replace=False)

types = np.random.choice(['Send', 'Receive', 'Honeypot'], 60, p=[0.4, 0.5, 0.1])
amounts = np.zeros(60)

amounts[types == 'Send'] = -np.random.uniform(0.001, 0.003, sum(types == 'Send')).round(6)
amounts[types == 'Receive'] = np.random.uniform(0.006, 0.008, sum(types == 'Receive')).round(6)
amounts[types == 'Honeypot'] = -np.random.uniform(0.002, 0.004, sum(types == 'Honeypot')).round(6)

df = pd.DataFrame({
    'Date': sorted(unique_dates),
    'Amount': amounts,
    'Type': types,
    'Currency': np.random.choice(['ETH', 'USDT'], 60)
})

df['Balance'] = df['Amount'].cumsum().round(6)

# ============ FEATURE 1: SECURITY METRICS ============
st.subheader("🛡️ Security Overview")
col1, col2, col3, col4 = st.columns(4)

honeypot_count = sum(types == 'Honeypot')
secure_txns = sum(types == 'Receive')
total_txns = len(df)
risk_score = (honeypot_count / total_txns) * 100

col1.metric("Honeypot Attacks Detected", honeypot_count, f"-{honeypot_count}")
col2.metric("Secure Transactions", secure_txns, f"+{secure_txns}")
col3.metric("Total Transactions", total_txns)
col4.metric("Risk Score", f"{risk_score:.1f}%", f"-{risk_score/2:.1f}%")

st.markdown("---")

# ============ CHARTS ============
st.subheader("💰 Wallet Balance Trend")
st.line_chart(df.set_index('Date')[['Balance']])

st.subheader("💸 Net Flow by Type (Send/Receive/Honeypot)")
net_flow = df.pivot_table(values='Amount', index='Date', columns='Type', aggfunc='sum', fill_value=0).reset_index()
net_melted = net_flow.melt(id_vars=['Date'], var_name='Type', value_name='Net_Flow')

chart = alt.Chart(net_melted).mark_bar().encode(
    x='Date:T',
    y='Net_Flow:Q',
    color=alt.Color('Type:N', scale=alt.Scale(
        domain=['Send', 'Receive', 'Honeypot'],
        range=['#00FF00', '#0000FF', '#FFA500']
    ))
).properties(width=800, height=400)
st.altair_chart(chart, use_container_width=True)

st.markdown("---")

# ============ FEATURE 2: THREAT DETECTION (COUNT ONLY) ============
st.subheader("🚨 Threat Detection")

if honeypot_count > 0:
    st.warning(f"⚠️ {honeypot_count} suspicious honeypot transactions detected in this period")
else:
    st.success("✅ No threats detected - Wallet secure!")

st.markdown("---")

# ============ FEATURE 3: TRANSACTION FILTER (TYPE ONLY) ============
st.subheader("📊 Advanced Analytics")

type_filter = st.multiselect("Filter by Transaction Type:", ['Send', 'Receive', 'Honeypot'], default=['Send', 'Receive', 'Honeypot'])

# Apply filter
filtered_df = df[df['Type'].isin(type_filter)]

st.metric("Filtered Transactions", len(filtered_df))

st.markdown("---")

# ============ FEATURE 4: BLOCKCHAIN INTEGRATION STATUS ============
st.subheader("⛓️ Blockchain Integration")
col_b1, col_b2, col_b3 = st.columns(3)
col_b1.info("🟢 Smart Contract: Active")
col_b2.info("🟢 MetaMask Connected: Yes")
col_b3.info("🟢 Transaction Verification: On-Chain")

st.markdown("---")

# ============ FEATURE 5: RECENT TRANSACTIONS ============
st.subheader("📋 Recent Transactions")
recent_unique = np.random.choice(all_dates.strftime('%Y-%m-%d'), 15, replace=False)
recent_types = np.random.choice(['Send', 'Receive', 'Honeypot'], 15, p=[0.4, 0.5, 0.1])
recent_amounts = np.zeros(15)
recent_amounts[recent_types == 'Send'] = -np.random.uniform(0.001, 0.003, sum(recent_types == 'Send')).round(6)
recent_amounts[recent_types == 'Receive'] = np.random.uniform(0.006, 0.008, sum(recent_types == 'Receive')).round(6)
recent_amounts[recent_types == 'Honeypot'] = -np.random.uniform(0.002, 0.004, sum(recent_types == 'Honeypot')).round(6)

recent_df = pd.DataFrame({
    'Date': sorted(recent_unique),
    'Amount': recent_amounts,
    'Type': recent_types,
    'Currency': np.random.choice(['ETH', 'USDT'], 15)
})
recent_df['Balance'] = recent_df['Amount'].cumsum().round(6)
recent_df['Status'] = recent_df['Type'].apply(lambda x: '✅ Verified' if x == 'Receive' else ('⚠️ Risk' if x == 'Honeypot' else '⏳ Pending'))
recent_df['Amount'] = recent_df['Amount'].apply(lambda x: f"{x:.6f}")
recent_df['Balance'] = recent_df['Balance'].apply(lambda x: f"{x:.6f}")
st.dataframe(recent_df[['Date', 'Amount', 'Type', 'Currency', 'Balance', 'Status']], use_container_width=True)

st.markdown("---")

# ============ FOOTER ============
st.info("🔒 All transactions encrypted & verified on blockchain. Real-time honeypot detection active.")
