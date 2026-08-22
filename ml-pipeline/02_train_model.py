import json
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import KFold, cross_val_score
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error, accuracy_score, f1_score, precision_score, recall_score

df = pd.read_csv('features_with_keys.csv')
df = df.dropna(subset=['target_severity']).copy()

RISK_BINS = [-0.001, 0.4, 0.7, 0.88, 1.001]
RISK_LABELS = ['low', 'medium', 'high', 'critical']


def to_risk_class(sev):
    return pd.cut(sev, bins=RISK_BINS, labels=RISK_LABELS)


feature_cols = [
    'children', 'cyber', 'ipc', 'sll', 'women',
    'ipc_log', 'ipc_state_pct', 'sll_log', 'sll_state_pct',
    'women_log', 'women_state_pct', 'children_log', 'children_state_pct',
    'cyber_log', 'cyber_state_pct',
    'ipc_prev', 'ipc_growth', 'ipc_gap_years',
    'women_prev', 'women_growth', 'women_gap_years',
    'children_prev', 'children_growth', 'children_gap_years',
    'cyber_prev', 'cyber_growth', 'cyber_gap_years',
    'severity', 'year',
]

state_dummies = pd.get_dummies(df['s_key'], prefix='state')
X_full = pd.concat([df[feature_cols].fillna(0), state_dummies], axis=1)
y_full = df['target_severity'].values

train_mask = df['target_year'] <= 2022
test_mask = df['target_year'] >= 2023

X_train, y_train = X_full[train_mask], y_full[train_mask]
X_test, y_test = X_full[test_mask], y_full[test_mask]

print(f"train rows={len(X_train)} (target_year<=2022)  test rows={len(X_test)} (target_year in 2023,2024)")

model = GradientBoostingRegressor(
    n_estimators=300, max_depth=3, learning_rate=0.05,
    subsample=0.8, random_state=42
)
model.fit(X_train, y_train)

pred_test = np.clip(model.predict(X_test), 0, 1)
pred_train = np.clip(model.predict(X_train), 0, 1)

r2_test = r2_score(y_test, pred_test)
mae_test = mean_absolute_error(y_test, pred_test)
rmse_test = mean_squared_error(y_test, pred_test) ** 0.5

r2_train = r2_score(y_train, pred_train)

# classification view: bucket predicted/actual severity into the same
# low/medium/high/critical bands the app already uses, for a metric
# comparable to the old (fabricated) "accuracy" figure
true_class = to_risk_class(y_test)
pred_class = to_risk_class(pred_test)
acc = accuracy_score(true_class, pred_class)
f1 = f1_score(true_class, pred_class, average='weighted')
prec = precision_score(true_class, pred_class, average='weighted', zero_division=0)
rec = recall_score(true_class, pred_class, average='weighted', zero_division=0)

persistence_class = df.loc[test_mask, 'risk_class']
persistence_acc = accuracy_score(true_class, persistence_class)
persistence_f1 = f1_score(true_class, persistence_class, average='weighted')

# 5-fold CV on the training period only (honest, no peeking at 2023-2024)
kf = KFold(n_splits=5, shuffle=True, random_state=42)
cv_r2 = cross_val_score(model, X_train, y_train, cv=kf, scoring='r2')

# naive baseline for context: "predict next year = this year's severity"
baseline_pred = np.clip(df.loc[test_mask, 'severity'].values, 0, 1)
baseline_r2 = r2_score(y_test, baseline_pred)
baseline_mae = mean_absolute_error(y_test, baseline_pred)

metrics = {
    'model': 'GradientBoostingRegressor (scikit-learn)',
    'target': 'target_severity (next-year composite severity score, 0-1)',
    'train_period': 'rows with target_year <= 2022',
    'test_period': 'rows with target_year in {2023, 2024} (true temporal holdout)',
    'train_rows': int(len(X_train)),
    'test_rows': int(len(X_test)),
    'feature_count': int(X_full.shape[1]),
    'test_r2': round(float(r2_test), 4),
    'test_mae': round(float(mae_test), 4),
    'test_rmse': round(float(rmse_test), 4),
    'train_r2': round(float(r2_train), 4),
    'cv_r2_mean_5fold_on_train': round(float(cv_r2.mean()), 4),
    'cv_r2_std_5fold_on_train': round(float(cv_r2.std()), 4),
    'risk_class_accuracy_on_holdout': round(float(acc), 4),
    'risk_class_precision_weighted_on_holdout': round(float(prec), 4),
    'risk_class_recall_weighted_on_holdout': round(float(rec), 4),
    'risk_class_weighted_f1_on_holdout': round(float(f1), 4),
    'naive_persistence_baseline_r2': round(float(baseline_r2), 4),
    'naive_persistence_baseline_mae': round(float(baseline_mae), 4),
    'naive_persistence_risk_class_accuracy': round(float(persistence_acc), 4),
    'naive_persistence_risk_class_f1': round(float(persistence_f1), 4),
    'top_features': sorted(
        zip(X_full.columns, model.feature_importances_),
        key=lambda t: -t[1]
    )[:8],
}
metrics['top_features'] = [{'feature': f, 'importance': round(float(i), 4)} for f, i in metrics['top_features']]

print(json.dumps(metrics, indent=2))

with open('model_metrics.json', 'w') as f:
    json.dump(metrics, f, indent=2)

import pickle
with open('model.pkl', 'wb') as f:
    pickle.dump({'model': model, 'feature_cols': list(X_full.columns)}, f)

print("\nwrote model_metrics.json and model.pkl")
